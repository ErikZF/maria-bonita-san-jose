/* ---------- Formulario de reservas (contáctenos) — envía por WhatsApp ---------- */

import { WHATSAPP_NUMBER, abrirWhatsApp } from "../config.js";

export function initContactForm() {
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
}
