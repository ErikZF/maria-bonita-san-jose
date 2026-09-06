/* ---------- Traducción ES <-> EN (sin servidor) ----------
   El HTML está en español (idioma base). Este módulo:
   1) guarda el texto original de la página,
   2) si el idioma activo es "en", reemplaza cada texto/atributo
      cuyo valor esté en el diccionario js/i18n/dict.js,
   3) expone MB.t(clave, vars) para textos que se generan por JS
      (carrusel, mensajes del formulario).

   Idioma elegido: ?lang=en|es  ->  localStorage("mb-lang")  ->  "es".
   El botón .lang-toggle del encabezado alterna y recuerda la opción. */

(function () {
  window.MB = window.MB || {};

  var STORAGE_KEY = "mb-lang";
  var ATTRS = ["placeholder", "aria-label", "alt", "title"];

  MB.__lang = "es";

  var norm = function (s) { return String(s).replace(/\s+/g, " ").trim(); };

  /* Traducción de una cadena concreta (para texto generado por JS). */
  MB.t = function (clave, vars) {
    var dict = MB.__lang !== "es" && MB.I18N && MB.I18N[MB.__lang];
    var out = (dict && dict[clave]) || clave;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.replace("{" + k + "}", vars[k]);
      });
    }
    return out;
  };

  var textNodes = [];   // [ [nodo, valorOriginal], ... ]
  var attrNodes = [];   // [ [elemento, atributo, valorOriginal], ... ]
  var origTitle = "";

  function dentroDeSvg(el) {
    return !!(el && el.closest && el.closest("svg"));
  }

  function tomarFoto() {
    textNodes = [];
    attrNodes = [];
    origTitle = document.title;

    var saltar = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1 };
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode;
      if (!p || saltar[p.nodeName]) continue;
      if (p.classList && p.classList.contains("lang-toggle")) continue;
      if (dentroDeSvg(p)) continue;
      if (!norm(n.nodeValue)) continue;
      textNodes.push([n, n.nodeValue]);
    }

    document.querySelectorAll("[" + ATTRS.join("],[") + "]").forEach(function (el) {
      if (dentroDeSvg(el)) return;
      ATTRS.forEach(function (a) {
        if (el.hasAttribute(a) && norm(el.getAttribute(a))) {
          attrNodes.push([el, a, el.getAttribute(a)]);
        }
      });
    });
  }

  function aplicar(lang) {
    MB.__lang = lang;
    document.documentElement.lang = lang;

    // 1) volver todo al español original
    textNodes.forEach(function (par) { par[0].nodeValue = par[1]; });
    attrNodes.forEach(function (t) { t[0].setAttribute(t[1], t[2]); });
    document.title = origTitle;

    // 2) si toca inglés, traducir lo que esté en el diccionario
    var dict = lang !== "es" && MB.I18N && MB.I18N[lang];
    if (dict) {
      textNodes.forEach(function (par) {
        var m = par[1].match(/^(\s*)([\s\S]*?)(\s*)$/);
        var tr = dict[norm(m[2])];
        if (tr != null) par[0].nodeValue = m[1] + tr + m[3];
      });
      attrNodes.forEach(function (t) {
        var tr = dict[norm(t[2])];
        if (tr != null) t[0].setAttribute(t[1], tr);
      });
      var tt = dict[norm(origTitle)];
      if (tt != null) document.title = tt;
    }

    actualizarBoton(lang);
  }

  function actualizarBoton(lang) {
    var btn = document.querySelector(".lang-toggle");
    if (!btn) return;
    var aIngles = lang === "es";
    btn.textContent = aIngles ? "EN" : "ES";
    btn.setAttribute("lang", aIngles ? "en" : "es");
    btn.setAttribute("aria-label", aIngles ? "Read this page in English" : "Ver esta página en español");
    btn.setAttribute("title", btn.getAttribute("aria-label"));
  }

  function idiomaInicial() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "en" || q === "es") {
      try { localStorage.setItem(STORAGE_KEY, q); } catch (e) {}
      return q;
    }
    var guardado = null;
    try { guardado = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return (guardado === "en" || guardado === "es") ? guardado : "es";
  }

  MB.initI18n = function () {
    tomarFoto();
    aplicar(idiomaInicial());

    var btn = document.querySelector(".lang-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var siguiente = MB.__lang === "en" ? "es" : "en";
        try { localStorage.setItem(STORAGE_KEY, siguiente); } catch (e) {}
        aplicar(siguiente);
      });
    }
  };
})();
