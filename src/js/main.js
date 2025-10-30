import Alpine from "alpinejs";
import * as AlpineComponents from "./components/alpine-components.js";
import AOS from "aos";

document.addEventListener("alpine:init", () => {
  Alpine.store("navigation", {
    currentPage: window.location.pathname.split("/").pop() || "index.html",
    isCurrent(page) {
      return this.currentPage === page;
    },
  });

  Alpine.data("form", AlpineComponents.form);
});

window.Alpine = Alpine;
Alpine.start();

AOS.init({
  disable: "mobile",
  offset: 0,
  duration: 500,
  easing: "ease-in-out",
  once: true,
  mirror: false,
  anchorPlacement: "top-bottom",
});
