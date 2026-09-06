/* =========================================================
   MARÍA BONITA — configuración compartida
   Valores que usan varios módulos. Cambiar aquí una sola vez.
   ========================================================= */

/* Número de WhatsApp del negocio en formato internacional, solo dígitos.
   TODO: reemplazar por el número real de María Bonita antes de publicar. */
export var WHATSAPP_NUMBER = "50688888888";

/* Abre WhatsApp (app o web) con un texto ya escrito. */
export function abrirWhatsApp(texto) {
  var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
  window.open(url, "_blank", "noopener");
}
