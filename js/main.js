/* =========================================================
   MARÍA BONITA — punto de entrada
   Se carga en TODAS las páginas DESPUÉS de config.js y los
   módulos (ver el bloque de <script> al final de cada HTML).
   Cada init revisa si sus elementos existen en la página
   actual, así que es seguro en cualquier página.
   ========================================================= */

(function () {
  window.MB = window.MB || {};

  function iniciar() {
    if (MB.initI18n) MB.initI18n();
    if (MB.initAnimations) MB.initAnimations();
    if (MB.initNav) MB.initNav();
    if (MB.initCarousel) MB.initCarousel();
    if (MB.initMenuTabs) MB.initMenuTabs();
    if (MB.initGallery) MB.initGallery();
    if (MB.initContactForm) MB.initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
