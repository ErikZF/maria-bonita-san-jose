/* ---------- Aparición al hacer scroll (IntersectionObserver) ----------
   Helper reutilizable: agrega una clase cuando el elemento entra en
   pantalla. Si el navegador no soporta IntersectionObserver, muestra
   todo de una vez. Lo usan la galería y las animaciones. */

(function () {
  window.MB = window.MB || {};

  MB.revealOnScroll = function (elements, options) {
    var els = Array.prototype.slice.call(elements || []);
    if (!els.length) return;

    var opts = options || {};
    var visibleClass = opts.visibleClass || "is-visible";
    var threshold = typeof opts.threshold === "number" ? opts.threshold : 0.15;
    var stagger = typeof opts.stagger === "number" ? opts.stagger : 0;
    var staggerMax = typeof opts.staggerMax === "number" ? opts.staggerMax : 360;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add(visibleClass); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: threshold });

    els.forEach(function (el, i) {
      if (stagger) el.style.transitionDelay = Math.min(i * stagger, staggerMax) + "ms";
      observer.observe(el);
    });
  };
})();
