/* ---------- Formulario de reservas (contáctenos) — envía por WhatsApp ----------
   Al enviar: valida, arma un mensaje y abre WhatsApp con el texto listo.
   No hay servidor: todo ocurre en el navegador. Necesita config.js antes. */

(function () {
  window.MB = window.MB || {};

  var TIPO_LABELS = {
    catering: "Catering / evento",
    mesa: "Mesa regular",
    cumpleanos: "Cumpleaños",
    corporativo: "Evento corporativo / posada",
    privado: "Salón privado",
    otro: "Otro"
  };

  MB.initContactForm = function () {
    var form = document.querySelector("#reserva-form") || document.querySelector(".contact-form");

    if (form && form.tagName === "FORM") {
      var msg = form.querySelector(".form-msg");

      var mostrarEstado = function (texto, estado) {
        if (!msg) return;
        msg.textContent = texto;
        msg.classList.remove("is-success", "is-error");
        msg.classList.add("is-visible");
        msg.classList.add(estado === "ok" ? "is-success" : "is-error");
      };

      var valor = function (id) {
        var campo = form.querySelector("#" + id);
        return campo ? campo.value.trim() : "";
      };

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validación nativa (los campos ya tienen required / type)
        if (typeof form.checkValidity === "function" && !form.checkValidity()) {
          if (typeof form.reportValidity === "function") form.reportValidity();
          mostrarEstado("Revisa los campos marcados antes de enviar.", "error");
          return;
        }

        var nombre = valor("nombre");
        var telefono = valor("telefono");
        var personas = valor("personas");
        var fecha = valor("fecha");
        var hora = valor("hora");
        var tipo = valor("tipo");
        var mensaje = valor("mensaje");

        var texto = "Hola María Bonita, quiero reservar:\n" +
          "Nombre: " + nombre + "\n" +
          "Teléfono/WhatsApp: " + telefono + "\n" +
          "Personas: " + personas + "\n" +
          "Fecha: " + fecha + "\n" +
          "Hora: " + hora + "\n" +
          "Tipo de reserva: " + (TIPO_LABELS[tipo] || tipo || "Sin especificar") +
          (mensaje ? "\nMensaje: " + mensaje : "");

        MB.abrirWhatsApp(texto);

        mostrarEstado(
          "Te llevamos a WhatsApp para enviar tu solicitud a María Bonita. " +
          "Si no se abrió, escríbenos directo al " + MB.WHATSAPP_DISPLAY + ".",
          "ok"
        );
        form.reset();
      });

      // Al corregir un campo, se quita el aviso de error
      form.addEventListener("input", function () {
        if (msg && msg.classList.contains("is-error")) {
          msg.classList.remove("is-visible", "is-error");
        }
      });
    }

    /* Fecha mínima = hoy, si el campo de fecha existe */
    var campoFecha = document.querySelector("#fecha");
    if (campoFecha && !campoFecha.getAttribute("min")) {
      campoFecha.setAttribute("min", new Date().toISOString().split("T")[0]);
    }
  };
})();
