/* =========================================================
   MARÍA BONITA — build sin dependencias
   ---------------------------------------------------------
   Arma el sitio estático a partir de src/:
     src/layout.html          esqueleto <html>
     src/partials/*.html      head, header, footer, scripts (comunes)
     src/pages/*.html         bloque <!-- meta --> + contenido único
     src/404.html             página de error (se copia tal cual)

   Genera, en la raíz del repo:
     index.html, menu/index.html, galeria/index.html,
     nosotros/index.html, catering/index.html,
     contacto/index.html, 404.html

   Uso:  node build.mjs      (o  npm run build)
   NO editar los HTML generados: se sobrescriben en cada build.
   ========================================================= */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const read = (p) => readFileSync(join(SRC, p), "utf8");

const layout = read("layout.html");
const partials = {
  HEAD: read("partials/head.html"),
  HEADER: read("partials/header.html"),
  FOOTER: read("partials/footer.html"),
  SCRIPTS: read("partials/scripts.html"),
};

const BANNER = "<!-- Archivo generado por build.mjs desde src/ — NO editar a mano -->\n";

/* Reemplazo literal seguro (sin interpretar $, \1, etc. de String.replace). */
function put(text, token, value) {
  return text.split(token).join(value);
}

/* Divide un archivo de página en { meta, body }. */
function parsePage(raw, file) {
  const m = raw.match(/^\s*<!--([\s\S]*?)-->\s*([\s\S]*)$/);
  if (!m) throw new Error(`${file}: falta el bloque <!-- title/nav/url --> al inicio`);
  const meta = {};
  for (const line of m[1].trim().split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (!meta.title) throw new Error(`${file}: falta "title" en el bloque meta`);
  return { meta, body: m[2].trim() };
}

const prefixFor = (url) => "../".repeat(url.split("/").filter(Boolean).length);

function buildPage(file) {
  const { meta, body } = parsePage(read(`pages/${file}`), file);
  const url = meta.url || "";
  const P = prefixFor(url);
  const HOME = P || "./"; // enlace a la home: "./" desde la raíz, "../" desde una subcarpeta
  const fill = (s) => put(put(s, "{{PREFIX}}", P), "{{HOME}}", HOME);

  // head con título y descripción de esta página
  let head = fill(partials.HEAD);
  head = put(head, "{{TITLE}}", meta.title);
  head = put(head, "{{DESCRIPTION}}", meta.description || "");

  // header con la pestaña activa marcada
  let header = fill(partials.HEADER);
  if (meta.nav) {
    header = header.replace(
      new RegExp(`(<a href="[^"]*" data-nav="${meta.nav}")`),
      `$1 aria-current="page"`
    );
  }
  header = header.replace(/ data-nav="[^"]*"/g, ""); // limpia los marcadores

  let out = layout;
  out = put(out, "{{HEAD}}", head.trim());
  out = put(out, "{{HEADER}}", header.trim());
  out = put(out, "{{BODY}}", fill(body).trim());
  out = put(out, "{{FOOTER}}", fill(partials.FOOTER).trim());
  out = put(out, "{{SCRIPTS}}", fill(partials.SCRIPTS).trim());

  const dest = url ? join(url, "index.html") : "index.html";
  writeTo(dest, BANNER + out.replace(/\r\n/g, "\n").trim() + "\n");
  return dest;
}

function writeTo(rel, content) {
  const abs = join(ROOT, rel);
  const dir = dirname(abs);
  if (dir !== ROOT) mkdirSync(dir, { recursive: true });
  writeFileSync(abs, content);
}

function run() {
  const pages = readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html")).sort();
  const written = pages.map(buildPage);

  // 404: se copia tal cual (es autocontenido, no usa el layout)
  writeTo("404.html", read("404.html").replace(/\r\n/g, "\n").trimEnd() + "\n");
  written.push("404.html");

  console.log("build.mjs — generado:");
  for (const f of written.sort()) console.log("  " + f.replace(/\\/g, "/"));
}

run();
