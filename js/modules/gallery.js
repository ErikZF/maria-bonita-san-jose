/* ---------- Galería dinámica: filtros + masonry animado + lightbox ----------
   (galeria.html) */

import { revealOnScroll } from "./reveal.js";

export function initGallery() {
  var galleryGrid = document.querySelector(".gallery-masonry");
  if (!galleryGrid) return;

  var figures = Array.prototype.slice.call(galleryGrid.querySelectorAll("figure"));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-tab"));

  /* Aparición escalonada al hacer scroll */
  revealOnScroll(figures, { threshold: 0.15, stagger: 60, staggerMax: 360 });

  /* Filtro por categoría */
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        figures.forEach(function (fig) {
          var match = filter === "todos" || fig.getAttribute("data-category") === filter;
          fig.classList.toggle("is-hidden", !match);
          if (match) fig.classList.add("is-visible");
        });
      });
    });
  }

  /* Lightbox con navegación anterior/siguiente */
  var lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;
  var lightboxImg = lightbox.querySelector("img");

  function visibleFigures() {
    return figures.filter(function (fig) { return !fig.classList.contains("is-hidden"); });
  }

  function showFigure(fig) {
    var img = fig.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.dataset.currentSrc = img.src;
    lightbox.classList.add("is-open");
  }

  function step(direction) {
    var visible = visibleFigures();
    var currentIndex = visible.findIndex(function (fig) {
      return fig.querySelector("img").src === lightbox.dataset.currentSrc;
    });
    if (currentIndex === -1) return;
    var nextIndex = (currentIndex + direction + visible.length) % visible.length;
    showFigure(visible[nextIndex]);
  }

  figures.forEach(function (fig) {
    fig.addEventListener("click", function () { showFigure(fig); });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
    lightbox.classList.remove("is-open");
  });
  lightbox.querySelector(".carousel-btn--prev").addEventListener("click", function (e) {
    e.stopPropagation(); step(-1);
  });
  lightbox.querySelector(".carousel-btn--next").addEventListener("click", function (e) {
    e.stopPropagation(); step(1);
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.classList.remove("is-open");
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") lightbox.classList.remove("is-open");
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}
