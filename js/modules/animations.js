/* ---------- Animaciones de aparición + sombra del encabezado ----------
   No toca el HTML de cada página: encuentra los elementos que ya
   existen, les agrega la clase .reveal y los observa con el helper
   MB.revealOnScroll (reveal.js debe cargarse antes). El CSS vive en
   css/animations.css. */

(function () {
  window.MB = window.MB || {};

  /* Cada entrada: un selector + opciones de aparición.
     Los selectores son disjuntos para no animar el mismo nodo dos veces. */
  var GRUPOS = [
    { sel: ".section:not(.hero) .container > .eyebrow, .section:not(.hero) .container > h2, .section:not(.hero) .container > h3, .section:not(.hero) .container > p", stagger: 60 },
    { sel: ".container[style*='center'] > *", stagger: 70 },
    { sel: ".values .value-card", stagger: 90 },
    { sel: ".reserve-text", variante: "reveal--left" },
    { sel: ".reserve .carousel", variante: "reveal--right" },
    { sel: ".whatsapp-section > img", variante: "reveal--left" },
    { sel: ".whatsapp-section > div", variante: "reveal--right" },
    { sel: ".whatsapp-banner", variante: "reveal--zoom" },
    { sel: ".about-grid > img", variante: "reveal--left" },
    { sel: ".about-grid > div", variante: "reveal--right" },
    { sel: ".timeline li", stagger: 80 },
    { sel: ".team-grid .team-card", stagger: 100 },
    { sel: ".catering-grid .catering-card", stagger: 100 },
    { sel: ".contact-form .field, .contact-form .full", stagger: 50 },
    { sel: ".contact-info", variante: "reveal--zoom" },
    { sel: ".menu-note", variante: "reveal--zoom" },
    { sel: ".footer-grid > *", stagger: 80 }
  ];

  MB.initAnimations = function () {
    var root = document.documentElement;
    root.classList.add("js-anim");

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var puedeObservar = typeof MB.revealOnScroll === "function";

    GRUPOS.forEach(function (grupo) {
      var nodos = Array.prototype.slice.call(document.querySelectorAll(grupo.sel));
      if (!nodos.length) return;

      var pendientes = [];
      nodos.forEach(function (el) {
        el.classList.add("reveal");
        if (grupo.variante) el.classList.add(grupo.variante);
        // Si ya está en pantalla al cargar, o no hay observer, mostrarlo de una vez.
        if (!puedeObservar || el.getBoundingClientRect().top < vh * 0.9) {
          el.classList.add("is-visible");
        } else {
          pendientes.push(el);
        }
      });

      if (puedeObservar) {
        MB.revealOnScroll(pendientes, { threshold: 0.12, stagger: grupo.stagger || 0, staggerMax: 400 });
      }
    });

    /* Sombra del encabezado al bajar */
    var header = document.querySelector(".site-header");
    if (header) {
      var actualizar = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      actualizar();
      window.addEventListener("scroll", actualizar, { passive: true });
    }
  };
})();
