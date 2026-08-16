import { useEffect, useState } from "react";
import { microfrontends } from "../config/microfrontends";

function getAppUrl(path: string) {
  if (
    path === "/" ||
    path === "/catalog" ||
    path === "/categories" ||
    path === "/products" ||
    path.startsWith("/products/") ||
    path.startsWith("/product/")
  ) {
    let catalogPath = path;

    if (path === "/" || path === "/catalog") {
      catalogPath = "/";
    }

    return `${microfrontends.catalog}${catalogPath}`;
  }

  if (path === "/cart" || path.startsWith("/cart/")) {
    const cartPath =
      path === "/cart"
        ? "/"
        : path.replace(/^\/cart/, "");

    return `${microfrontends.cart}${cartPath}`;
  }

  if (
    path === "/account" ||
    path.startsWith("/account/")
  ) {
    const accountPath =
      path === "/account"
        ? "/"
        : path.replace(/^\/account/, "");

    return `${microfrontends.account}${accountPath}`;
  }

  return microfrontends.catalog;
}

export default function AppRouter() {
  const getCurrentPath = () => {
    return (
      window.location.pathname +
      window.location.search
    );
  };

  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath());
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
      const data = event.data || {};

     
      if (data.type === "ElectroShop:add-to-cart") {
        console.log(
          "Shell received product:",
          data.product
        );

        /*
         * Save product temporarily.
         *
         * This allows the Cart to receive the
         * product when the user opens /cart.
         */
        const existingCart = JSON.parse(
          localStorage.getItem("ElectroShop:cart") || "[]"
        );

        const existingItem = existingCart.find(
          (item: any) =>
            item.id === data.product.id
        );

        if (existingItem) {
          existingItem.quantity += data.delta || 1;
        } else {
          existingCart.push({
            ...data.product,
            quantity: data.delta || 1,
          });
        }

        localStorage.setItem(
          "ElectroShop:cart",
          JSON.stringify(existingCart)
        );
        const iframe =
          document.querySelector(
            'iframe[title="ElectroShop Microfrontend"]'
          ) as HTMLIFrameElement | null;

        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: "ElectroShop:cart-updated",
              productId: data.product.id,
              success: true,
            },
            "*"
          );
        }

        if (
          path === "/cart" ||
          path.startsWith("/cart/")
        ) {
          const cartIframe =
            document.querySelector(
              'iframe[title="ElectroShop Microfrontend"]'
            ) as HTMLIFrameElement | null;

          if (cartIframe?.contentWindow) {
            cartIframe.contentWindow.postMessage(
              {
                type: "ElectroShop:add-to-cart",
                product: data.product,
                delta: data.delta || 1,
              },
              "*"
            );
          }
        }
      }

      /*
       * Cart -> Shell
       */
      if (
        data.type ===
        "ElectroShop:cart-updated"
      ) {
        console.log(
          "Cart confirmed:",
          data.productId
        );

        /*
         * Forward confirmation to Catalog
         */
        const iframe =
          document.querySelector(
            'iframe[title="ElectroShop Microfrontend"]'
          ) as HTMLIFrameElement | null;

        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: "ElectroShop:cart-updated",
              productId: data.productId,
              success: true,
            },
            "*"
          );
        }
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
  }, [path]);

  /*
   * Send stored cart to Cart when /cart opens
   */
  useEffect(() => {
    if (
      path !== "/cart" &&
      !path.startsWith("/cart/")
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const cart =
        JSON.parse(
          localStorage.getItem(
            "ElectroShop:cart"
          ) || "[]"
        );

      const iframe =
        document.querySelector(
          'iframe[title="ElectroShop Microfrontend"]'
        ) as HTMLIFrameElement | null;

      if (
        iframe?.contentWindow &&
        cart.length > 0
      ) {
        iframe.contentWindow.postMessage(
          {
            type: "ElectroShop:load-cart",
            cart,
          },
          "*"
        );
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [path]);

  const appUrl = getAppUrl(path);

  return (
    <iframe
      key={appUrl}
      src={appUrl}
      title="ElectroShop Microfrontend"
      style={{
        width: "100%",
        height: "calc(100vh - 78px)",
        minHeight: "800px",
        border: "none",
        display: "block",
      }}
    />
  );
}