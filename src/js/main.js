import Alpine from "alpinejs";
import * as AlpineComponents from "./components/alpine-components.js";
import AOS from "aos";

document.addEventListener("alpine:init", () => {
  console.log("Alpine initialized");

  Alpine.store("navigation", {
    currentPage: window.location.pathname.split("/").pop() || "index.html",
    isCurrent(page) {
      return this.currentPage === page;
    },
  });

  Alpine.data("form", AlpineComponents.form);
  console.log("🏔️ Alpine.js initialized!");
});

window.Alpine = Alpine;
Alpine.start();
AOS.init({
  offset: 0,
  duration: 500,
  easing: "ease-in-out",
  once: true,
  mirror: false,
  anchorPlacement: "top-bottom",
});

console.log("App ready");
