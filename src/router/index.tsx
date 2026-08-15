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

  const appUrl = getAppUrl(path);

  return (
    <iframe
      key={appUrl}
      src={appUrl}
      title="ElectroShop Microfrontend"
      style={{width: "100%", height: "calc(100vh - 78px)",minHeight: "800px",border: "none",display: "block",}}
    />
  );
}