import { useEffect, useState } from "react";
import { microfrontends } from "../config/microfrontends";

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  if (!path || path === "/") {
    return `${base}/`;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function getAppUrl(path: string) {
  const [pathname] = path.split("?");

  // ==========================================
  // Catalog & Discovery
  // ==========================================
  if (
    pathname === "/" ||
    pathname === "/catalog" ||
    pathname === "/categories" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/product/")
  ) {
    const catalogPath =
      pathname === "/catalog"
        ? "/"
        : path;

    return joinUrl(
      microfrontends.catalog,
      catalogPath
    );
  }

  // ==========================================
  // Cart & Checkout
  // ==========================================
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

  // ==========================================
  // Account & Orders
  // ==========================================
  if (
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/wishlist"
  ) {
    let accountPath = path;

    // /account
    if (pathname === "/account") {
      accountPath = "/";
    }

    // /wishlist
    else if (pathname === "/wishlist") {
      accountPath = path;
    }

    // /account/profile
    // /account/orders
    // /account/reviews
    // /account/wishlist
    else if (pathname.startsWith("/account/")) {
      accountPath =
        path.replace(/^\/account/, "") || "/";
    }

    return joinUrl(
      microfrontends.account,
      accountPath
    );
  }

  // ==========================================
  // Fallback
  // ==========================================
  return joinUrl(
    microfrontends.catalog,
    "/"
  );
}

export default function AppRouter() {
  const getCurrentPath = () => {
    return (
      window.location.pathname +
      window.location.search
    );
  };

  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    // Browser Back / Forward
    const handlePopState = () => {
      setPath(getCurrentPath());
    };

    // Navigation messages from Microfrontends
    const handleMessage = (event: MessageEvent) => {
      const messageType = event.data?.type;

      if (
        messageType !== "NAVIGATE" &&
        messageType !== "MICROFRONTEND_NAVIGATE"
      ) {
        return;
      }

      const newPath = event.data?.path;

      if (
        typeof newPath !== "string" ||
        !newPath
      ) {
        return;
      }

      // Update browser URL
      window.history.pushState(
        {},
        "",
        newPath
      );

      // Update React state
      setPath(newPath);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    window.addEventListener(
      "message",
      handleMessage
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );

      window.removeEventListener(
        "message",
        handleMessage
      );
    };
  }, []);

  // Determine which Microfrontend should be displayed
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
        background: "#fff",
      }}
    />
  );
}