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
MB.WHATSAPP_NUMBER = "50686755665";

/* Cómo se muestra el número a la persona (mismos dígitos, con formato). */
MB.WHATSAPP_DISPLAY = "+506 8675-5665";

/* Teléfono fijo del restaurante (distinto del WhatsApp). Solo se muestra
   y se usa para el enlace tel:, no participa en el envío por WhatsApp. */
MB.PHONE_NUMBER = "50622565462";
MB.PHONE_DISPLAY = "+506 2256-5462";

/* Abre WhatsApp (app o web) con un texto ya escrito. */
MB.abrirWhatsApp = function (texto) {
  var url = "https://wa.me/" + MB.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
  window.open(url, "_blank", "noopener");
};
