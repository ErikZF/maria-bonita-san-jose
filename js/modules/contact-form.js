/* ---------- Formulario de reservas (contáctenos) — envía por WhatsApp ----------
   Al enviar: valida campo por campo (mensajes en línea), arma un
   mensaje y abre WhatsApp con el texto listo. No hay servidor: todo
   ocurre en el navegador. Necesita config.js cargado antes. */

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

  /* Horario de atención por día de la semana (0 = domingo).
     null = cerrado. [ [horaApertura], [horaCierre] ] en [hora, minuto]. */
  var HORARIO = {
    0: [[11, 30], [20, 0]],
    1: null,
    2: [[11, 30], [20, 30]],
    3: [[11, 30], [20, 30]],
    4: [[11, 30], [20, 30]],
    5: [[11, 30], [22, 0]],
    6: [[11, 30], [22, 0]]
  };

  var hhmm = function (par) {
    return (par[0] < 10 ? "0" : "") + par[0] + ":" + (par[1] < 10 ? "0" : "") + par[1];
  };

  /* YYYY-MM-DD en hora LOCAL (toISOString usa UTC y puede saltar de día). */
  var fechaLocal = function (dt) {
    var t = dt || new Date();
    return t.getFullYear() + "-" +
      ("0" + (t.getMonth() + 1)).slice(-2) + "-" +
      ("0" + t.getDate()).slice(-2);
  };

  /* Regla por campo: devuelve "" si está bien, o el texto del error. */
  var REGLAS = {
    nombre: function (v) {
      if (!v) return "Escribe tu nombre.";
      if (v.length < 2) return "El nombre es muy corto.";
      if (!/^[\p{L}\p{M} .'-]+$/u.test(v)) return "Usa solo letras.";
      return "";
    },
    telefono: function (v) {
      if (!v) return "Escribe un teléfono de contacto.";
      var digitos = v.replace(/\D/g, "");
      if (digitos.length < 8) return "El teléfono debe tener al menos 8 dígitos.";
      if (digitos.length > 15) return "Ese teléfono no parece válido.";
      return "";
    },
    personas: function (v) {
      if (!v) return "Indica cuántas personas.";
      var n = Number(v);
      if (!Number.isInteger(n) || n < 1) return "Debe ser al menos 1 persona.";
      if (n > 80) return "Para más de 80 personas, escríbenos por WhatsApp directo.";
      return "";
    },
    fecha: function (v) {
      if (!v) return "Elige una fecha.";
      var d = new Date(v + "T00:00:00");
      if (isNaN(d.getTime())) return "Fecha no válida.";
      var hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (d < hoy) return "Esa fecha ya pasó.";
      var maxD = new Date(hoy);
      maxD.setFullYear(maxD.getFullYear() + 1);
      if (d > maxD) return "Elige una fecha dentro del próximo año.";
      return "";
    },
    hora: function (v) {
      if (!v) return "Elige una hora.";
      return "";
    },
    tipo: function (v) {
      if (!v) return "Elige el tipo de reserva.";
      return "";
    },
    mensaje: function (v) {
      if (v.length > 600) return "El mensaje es muy largo (máx. 600 caracteres).";
      return "";
    }
  };

  /* Chequeo cruzado fecha + hora contra el horario de atención. */
  function validarAgenda(fechaStr, horaStr) {
    if (!fechaStr || !horaStr) return null;
    var d = new Date(fechaStr + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    var rango = HORARIO[d.getDay()];
    if (!rango) return { campo: "fecha", msg: "Los lunes el restaurante está cerrado." };
    var p = horaStr.split(":");
    var minutos = Number(p[0]) * 60 + Number(p[1]);
    var abre = rango[0][0] * 60 + rango[0][1];
    var cierra = rango[1][0] * 60 + rango[1][1];
    if (minutos < abre || minutos > cierra) {
      return { campo: "hora", msg: "Ese día atendemos de " + hhmm(rango[0]) + " a " + hhmm(rango[1]) + "." };
    }
    return null;
  }

  MB.initContactForm = function () {
    var form = document.querySelector("#reserva-form") || document.querySelector(".contact-form");

    if (form && form.tagName === "FORM") {
      var estado = form.querySelector(".form-msg");
      var nombresCampos = Object.keys(REGLAS);

      // Asegura un <small class="field-error"> bajo cada campo (sin tocar el HTML)
      var erroresUI = {};
      nombresCampos.forEach(function (name) {
        var input = form.querySelector("#" + name);
        if (!input) return;
        var contenedor = input.closest(".field");
        if (!contenedor) return;
        var small = contenedor.querySelector(".field-error");
        if (!small) {
          small = document.createElement("small");
          small.className = "field-error";
          small.id = "err-" + name;
          contenedor.appendChild(small);
        }
        input.setAttribute("aria-describedby", small.id);
        erroresUI[name] = { input: input, contenedor: contenedor, small: small };
      });

      var valor = function (name) {
        var el = form.querySelector("#" + name);
        return el ? el.value.trim() : "";
      };

      var pintarCampo = function (name, msg) {
        var ui = erroresUI[name];
        if (!ui) return;
        ui.contenedor.classList.toggle("error", !!msg);
        ui.input.setAttribute("aria-invalid", msg ? "true" : "false");
        ui.small.textContent = msg || "";
      };

      var validarCampo = function (name) {
        if (!REGLAS[name] || !erroresUI[name]) return "";
        var msg = REGLAS[name](valor(name));
        pintarCampo(name, msg);
        return msg;
      };

      var mostrarEstado = function (texto, tipo) {
        if (!estado) return;
        estado.textContent = texto;
        estado.classList.remove("is-success", "is-error");
        estado.classList.add("is-visible", tipo === "ok" ? "is-success" : "is-error");
      };

      var limpiarEstado = function () {
        if (estado) estado.classList.remove("is-visible", "is-error", "is-success");
      };

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var primerInvalido = null;
        var faltan = 0;

        nombresCampos.forEach(function (name) {
          if (!erroresUI[name]) return;
          var msg = validarCampo(name);
          if (msg && !primerInvalido) primerInvalido = erroresUI[name].input;
          if (msg) faltan++;
        });

        // Chequeo cruzado fecha + hora (solo si ambos campos ya están bien)
        if (!validarCampo("fecha") && !validarCampo("hora")) {
          var cruce = validarAgenda(valor("fecha"), valor("hora"));
          if (cruce) {
            pintarCampo(cruce.campo, cruce.msg);
            if (!primerInvalido) primerInvalido = erroresUI[cruce.campo].input;
            faltan++;
          }
        }

        if (faltan) {
          mostrarEstado(
            faltan === 1 ? "Revisa el campo marcado antes de enviar."
              : "Revisa los " + faltan + " campos marcados antes de enviar.",
            "error"
          );
          if (primerInvalido) primerInvalido.focus();
          return;
        }

        var texto = "Hola María Bonita, quiero reservar:\n" +
          "Nombre: " + valor("nombre") + "\n" +
          "Teléfono/WhatsApp: " + valor("telefono") + "\n" +
          "Personas: " + valor("personas") + "\n" +
          "Fecha: " + valor("fecha") + "\n" +
          "Hora: " + valor("hora") + "\n" +
          "Tipo de reserva: " + (TIPO_LABELS[valor("tipo")] || valor("tipo") || "Sin especificar") +
          (valor("mensaje") ? "\nMensaje: " + valor("mensaje") : "");

        MB.abrirWhatsApp(texto);

        mostrarEstado(
          "Te llevamos a WhatsApp para enviar tu solicitud a María Bonita. " +
          "Si no se abrió, escríbenos directo al " + MB.WHATSAPP_DISPLAY + ".",
          "ok"
        );
        form.reset();
        nombresCampos.forEach(function (name) { pintarCampo(name, ""); });
      });

      // Revalida cada campo al salir de él y al corregirlo
      nombresCampos.forEach(function (name) {
        var ui = erroresUI[name];
        if (!ui) return;
        ui.input.addEventListener("blur", function () { validarCampo(name); });
        ui.input.addEventListener("input", function () {
          if (ui.contenedor.classList.contains("error")) validarCampo(name);
          limpiarEstado();
        });
        ui.input.addEventListener("change", function () { validarCampo(name); });
      });
    }

    /* Fecha mínima = hoy, si el campo de fecha existe */
    var campoFecha = document.querySelector("#fecha");
    if (campoFecha && !campoFecha.getAttribute("min")) {
      campoFecha.setAttribute("min", fechaLocal());
    }
  };
})();
