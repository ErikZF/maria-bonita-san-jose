/* =========================================================
   MARÍA BONITA — punto de entrada
   Este archivo se carga en TODAS las páginas como módulo:
     <script type="module" src="../js/main.js"></script>
   Cada módulo revisa primero si sus elementos existen en la
   página actual, así que es seguro cargarlo en cualquier página.
   ========================================================= */

import { initNav } from "./modules/nav.js";
import { initCarousel } from "./modules/carousel.js";
import { initMenuTabs } from "./modules/menu-tabs.js";
import { initGallery } from "./modules/gallery.js";
import { initContactForm } from "./modules/contact-form.js";

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initCarousel();
  initMenuTabs();
  initGallery();
  initContactForm();
});
