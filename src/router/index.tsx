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

    if (
      path === "/" ||
      path === "/catalog"
    ) {
      catalogPath = "/";
    }

    return `${microfrontends.catalog}${catalogPath}`;
  }

  if (
    path === "/cart" ||
    path.startsWith("/cart/")
  ) {
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

  return `${microfrontends.catalog}/`;
}


export default function AppRouter() {

  // أول ما يفتح الموقع يبدأ من Home
  const [path, setPath] =
    useState("/");

  useEffect(() => {

    // أول دخول للموقع يرجع للمسار الرئيسي
    window.history.replaceState(
      {},
      "",
      "/"
    );

    setPath("/");


    const handlePopState = () => {
      const currentPath =
        window.location.pathname;

      setPath(currentPath);
    };


    const handleMessage = (
      event: MessageEvent
    ) => {

      if (
        event.data?.type === "NAVIGATE" &&
        event.data?.path
      ) {

        const newPath =
          event.data.path;

        window.history.pushState(
          {},
          "",
          newPath
        );

        setPath(newPath);
      }
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


  const appUrl =
    getAppUrl(path);


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