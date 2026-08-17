import { useEffect, useState } from "react";
import { microfrontends } from "../config/microfrontends";

const AUTH_KEY = "ElectroShop:isLoggedIn";

function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  if (!path || path === "/") {
    return `${base}/`;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function getAppUrl(path: string): string {
  const [pathname] = path.split("?");

  if (
    pathname === "/account/login" ||
    pathname === "/account/register"
  ) {
    return joinUrl(microfrontends.account, path);
  }

  if (
    pathname === "/" ||
    pathname === "/catalog" ||
    pathname === "/categories" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/product/")
  ) {
    const catalogPath =
      pathname === "/catalog" ? "/" : path;

    return joinUrl(
      microfrontends.catalog,
      catalogPath
    );
  }

  if (
    pathname === "/cart" ||
    pathname.startsWith("/cart/")
  ) {
    const cartPath =
      pathname === "/cart"
        ? "/"
        : path.replace(/^\/cart/, "") || "/";

    return joinUrl(
      microfrontends.cart,
      cartPath
    );
  }

  if (
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/wishlist"
  ) {
    let accountPath = "/";

    if (pathname === "/account") {
      accountPath = "/";
    } else if (pathname === "/wishlist") {
      accountPath = "/wishlist";
    } else {
      accountPath =
        path.replace(/^\/account/, "") || "/";
    }

    return joinUrl(
      microfrontends.account,
      accountPath
    );
  }

  return joinUrl(
    microfrontends.catalog,
    "/"
  );
}

export default function AppRouter() {
  const getCurrentPath = (): string => {
    return (
      window.location.pathname +
      window.location.search
    );
  };

  const getValidPath = (): string => {
    const currentPath = getCurrentPath();
    const loggedIn = isLoggedIn();

    const isAuthPage =
      currentPath === "/account/login" ||
      currentPath === "/account/register";

    if (!loggedIn && !isAuthPage) {
      window.history.replaceState(
        {},
        "",
        "/account/login"
      );

      return "/account/login";
    }

    if (loggedIn && isAuthPage) {
      window.history.replaceState(
        {},
        "",
        "/"
      );

      return "/";
    }

    return currentPath;
  };

  const [path, setPath] = useState<string>(
    getValidPath
  );

  useEffect(() => {
    const handlePopState = () => {
      setPath(getValidPath());
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (!message?.type) {
        return;
      }

      if (message.type === "LOGIN_SUCCESS") {
        localStorage.setItem(
          AUTH_KEY,
          "true"
        );

        window.history.replaceState(
          {},
          "",
          "/"
        );

        setPath("/");

        return;
      }

      if (message.type === "LOGOUT") {
        localStorage.removeItem(
          AUTH_KEY
        );

        localStorage.removeItem(
          "ElectroShop:user"
        );

        window.history.replaceState(
          {},
          "",
          "/account/login"
        );

        setPath("/account/login");

        return;
      }

      if (
        message.type === "NAVIGATE" ||
        message.type === "MICROFRONTEND_NAVIGATE"
      ) {
        const newPath = message.path;

        if (
          typeof newPath !== "string" ||
          !newPath
        ) {
          return;
        }

        const loggedIn = isLoggedIn();

        const isAuthPage =
          newPath === "/account/login" ||
          newPath === "/account/register";

        if (!loggedIn && !isAuthPage) {
          window.history.replaceState(
            {},
            "",
            "/account/login"
          );

          setPath("/account/login");

          return;
        }

        if (loggedIn && isAuthPage) {
          window.history.replaceState(
            {},
            "",
            "/"
          );

          setPath("/");

          return;
        }

        window.history.pushState(
          {},
          "",
          newPath
        );

        setPath(newPath);

        return;
      }

      if (message.type === "GET_WISHLIST") {
        try {
          const wishlist = JSON.parse(
            localStorage.getItem(
              "ElectroShop:wishlist"
            ) || "[]"
          );

          if (
            event.source &&
            "postMessage" in event.source
          ) {
            (
              event.source as Window
            ).postMessage(
              {
                type: "WISHLIST_DATA",
                wishlist:
                  Array.isArray(wishlist)
                    ? wishlist
                    : [],
              },
              "*"
            );
          }
        } catch (error) {
          console.error(
            "Failed to load wishlist:",
            error
          );
        }

        return;
      }

      if (message.type === "ADD_TO_CART") {
        try {
          const existingCart = JSON.parse(
            localStorage.getItem(
              "ElectroShop:cart"
            ) || "[]"
          );

          const productId =
            message.productId;

          const delta =
            Number(message.delta) || 1;

          const existingIndex =
            existingCart.findIndex(
              (item: any) =>
                item.productId === productId
            );

          if (existingIndex !== -1) {
            existingCart[
              existingIndex
            ].quantity += delta;
          } else {
            existingCart.push({
              productId,
              product: message.product,
              quantity: delta,
            });
          }

          localStorage.setItem(
            "ElectroShop:cart",
            JSON.stringify(existingCart)
          );

          if (
            event.source &&
            "postMessage" in event.source
          ) {
            (
              event.source as Window
            ).postMessage(
              {
                type: "CART_UPDATED",
                productId,
                success: true,
              },
              "*"
            );
          }

          window.history.pushState(
            {},
            "",
            "/cart"
          );

          setPath("/cart");
        } catch (error) {
          console.error(
            "Failed to update cart:",
            error
          );
        }

        return;
      }

      if (
        message.type === "WISHLIST_UPDATED"
      ) {
        try {
          const wishlist = JSON.parse(
            localStorage.getItem(
              "ElectroShop:wishlist"
            ) || "[]"
          );

          const productId =
            message.productId;

          const liked =
            message.liked === true;

          const exists =
            wishlist.some(
              (item: any) =>
                item.productId === productId
            );

          let updatedWishlist;

          if (liked && !exists) {
            updatedWishlist = [
              ...wishlist,
              {
                productId,
                product: message.product,
              },
            ];
          } else if (!liked) {
            updatedWishlist =
              wishlist.filter(
                (item: any) =>
                  item.productId !== productId
              );
          } else {
            updatedWishlist = wishlist;
          }

          localStorage.setItem(
            "ElectroShop:wishlist",
            JSON.stringify(
              updatedWishlist
            )
          );

          if (
            event.source &&
            "postMessage" in event.source
          ) {
            (
              event.source as Window
            ).postMessage(
              {
                type: "WISHLIST_STATE",
                productId,
                liked,
              },
              "*"
            );
          }

          window.postMessage(
            {
              type: "WISHLIST_CHANGED",
              productId,
              liked,
              product: message.product,
            },
            "*"
          );
        } catch (error) {
          console.error(
            "Failed to update wishlist:",
            error
          );
        }

        return;
      }
    };

    window.addEventListener(
      "message",
      handleMessage
    );

    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );
    };
  }, []);

  const appUrl = getAppUrl(path);

  return (
    <iframe
      key={appUrl}
      src={appUrl}
      title="ElectroShop Microfrontend"
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "800px",
        border: "none",
        display: "block",
        background: "#fff",
      }}
    />
  );
}