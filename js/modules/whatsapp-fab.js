/* ---------- Botón flotante de WhatsApp ----------
   Se inyecta en todas las páginas (no hay que tocar el HTML).
   Usa el número central de config.js. El texto de la etiqueta lo
   traduce i18n.js, por eso este módulo se ejecuta ANTES de initI18n
   (así el texto queda en la "foto" que toma la traducción). */

(function () {
  window.MB = window.MB || {};

  var SALUDO = "Hola María Bonita, tengo una consulta.";
  var ETIQUETA = "Escríbenos por WhatsApp";

  MB.initWhatsAppFab = function () {
    if (document.querySelector(".wa-fab")) return;

    var numero = MB.WHATSAPP_NUMBER || "";
    var href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(SALUDO);

    var a = document.createElement("a");
    a.className = "wa-fab";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", ETIQUETA);

    a.innerHTML =
      '<span class="wa-fab-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
          '<path fill="currentColor" d="M16.04 4C9.4 4 4 9.4 4 16.03c0 2.12.56 4.19 1.62 6.02L4 28l6.13-1.6a12 12 0 0 0 5.9 1.5h.01c6.63 0 12.03-5.4 12.03-12.03 0-3.21-1.25-6.23-3.52-8.5A11.94 11.94 0 0 0 16.04 4Zm0 21.93h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.22-3.76.99 1-3.67-.24-.38a9.93 9.93 0 0 1-1.52-5.27c0-5.5 4.48-9.98 9.99-9.98 2.67 0 5.17 1.04 7.06 2.93a9.9 9.9 0 0 1 2.92 7.06c0 5.5-4.48 9.98-9.99 9.98Zm5.48-7.47c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.5-.68-.51l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.92 1.23 3.12.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"/>' +
        '</svg>' +
      '</span>' +
      '<span class="wa-fab-label">' + ETIQUETA + '</span>';

    document.body.appendChild(a);
  };
})();
