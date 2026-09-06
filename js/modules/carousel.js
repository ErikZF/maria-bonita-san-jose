/* ---------- Carrusel de "Reserve su mesa o evento" ---------- */

(function () {
  window.MB = window.MB || {};

  MB.initCarousel = function () {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    var track = carousel.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-slide"));
    var dotsWrap = carousel.querySelector(".carousel-dots");
    var current = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (current * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    carousel.querySelector(".carousel-btn--next").addEventListener("click", function () { goTo(current + 1); resetTimer(); });
    carousel.querySelector(".carousel-btn--prev").addEventListener("click", function () { goTo(current - 1); resetTimer(); });

    resetTimer();
  };
})();
