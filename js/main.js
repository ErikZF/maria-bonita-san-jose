/* Número de WhatsApp del negocio en formato internacional, solo dígitos.
   TODO: reemplazar por el número real de María Bonita antes de publicar. */
var WHATSAPP_NUMBER = "50688888888";

function abrirWhatsApp(texto) {
  var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
  window.open(url, "_blank", "noopener");
}

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Menú de navegación móvil ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Carrusel de "Reserve su mesa o evento" ---------- */
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
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
  }

  /* ---------- Tabs del menú ---------- */
  var tabs = document.querySelectorAll(".menu-tab");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-target");
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        document.querySelectorAll(".menu-group").forEach(function (group) {
          group.classList.toggle("is-active", group.id === target);
        });
      });
    });
  }

  /* ---------- Galería dinámica: filtros + masonry animado ---------- */
  var galleryGrid = document.querySelector(".gallery-masonry");
  if (galleryGrid) {
    var figures = Array.prototype.slice.call(galleryGrid.querySelectorAll("figure"));
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-tab"));

    /* Aparición escalonada al hacer scroll */
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      figures.forEach(function (fig, i) {
        fig.style.transitionDelay = Math.min(i * 60, 360) + "ms";
        revealObserver.observe(fig);
      });
    } else {
      figures.forEach(function (fig) { fig.classList.add("is-visible"); });
    }

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
    if (lightbox) {
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
  }

  /* ---------- Formulario de reservas (contáctenos) — envía por WhatsApp ---------- */
  var form = document.querySelector("#reserva-form");
  if (form) {
    var msg = form.querySelector(".form-msg");
    var tipoLabels = {
      mesa: "Mesa regular",
      cumpleanos: "Cumpleaños",
      corporativo: "Evento corporativo / posada",
      privado: "Salón privado",
      otro: "Otro"
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nombre = form.querySelector("#nombre").value.trim();
      var telefono = form.querySelector("#telefono").value.trim();
      var personas = form.querySelector("#personas").value.trim();
      var fecha = form.querySelector("#fecha").value;
      var hora = form.querySelector("#hora").value;
      var tipo = form.querySelector("#tipo").value;
      var mensaje = form.querySelector("#mensaje").value.trim();

      var texto = "Hola María Bonita, quiero reservar:\n" +
        "Nombre: " + nombre + "\n" +
        "Teléfono/WhatsApp: " + telefono + "\n" +
        "Personas: " + personas + "\n" +
        "Fecha: " + fecha + "\n" +
        "Hora: " + hora + "\n" +
        "Tipo de reserva: " + (tipoLabels[tipo] || tipo) +
        (mensaje ? "\nMensaje: " + mensaje : "");

      abrirWhatsApp(texto);

      msg.textContent = "Te estamos llevando a WhatsApp para enviar tu reserva a María Bonita. Si no se abrió, escríbenos directo al " + "+" + WHATSAPP_NUMBER + ".";
      msg.classList.add("is-visible", "is-success");
      form.reset();
    });
  }

  /* Fecha mínima = hoy, si el campo de fecha existe */
  var fecha = document.querySelector("#fecha");
  if (fecha) {
    var hoy = new Date().toISOString().split("T")[0];
    fecha.setAttribute("min", hoy);
  }

});
