/* =========================================================
   MARÍA BONITA — configuración compartida
   Valores que usan varios módulos. Cambiar aquí una sola vez.

   Los scripts se cargan como <script> clásicos (sin type="module")
   para que el sitio funcione tanto abierto con doble clic (file://)
   como servido por Hostinger. Cada archivo registra lo suyo en el
   objeto global window.MB.
   ========================================================= */

window.MB = window.MB || {};

/* Número de WhatsApp del negocio en formato internacional, solo dígitos.
   Debe coincidir con los enlaces wa.me y los textos "+506 ..." del HTML. */
MB.WHATSAPP_NUMBER = "50687401660";

/* Cómo se muestra el número a la persona (mismos dígitos, con formato). */
MB.WHATSAPP_DISPLAY = "+506 8740-1660";

/* Abre WhatsApp (app o web) con un texto ya escrito. */
MB.abrirWhatsApp = function (texto) {
  var url = "https://wa.me/" + MB.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
  window.open(url, "_blank", "noopener");
};
