# María Bonita — sitio estático

Cocina mexicana en La Pitaya, San José. HTML + CSS + JS puro, **sin frameworks**.
El HTML se arma con un pequeño build sin dependencias para no repetir el
encabezado, el pie ni la lista de scripts en cada página.

## Estructura

```
src/                     ← FUENTE (se edita esto)
  layout.html            esqueleto <html>…</html>
  partials/
    head.html            <head>: metas, fuentes, CSS   (usa {{TITLE}} {{DESCRIPTION}} {{PREFIX}})
    header.html           encabezado + navegación       (usa {{PREFIX}} y data-nav)
    footer.html           pie de página                 (usa {{PREFIX}})
    scripts.html          los <script defer>            (usa {{PREFIX}})
  pages/
    inicio.html  menu.html  galeria.html
    nosotros.html  catering.html  contacto.html
      → cada uno: un bloque <!-- meta --> + SOLO el contenido único de esa página
  404.html               página de error (autocontenida, se copia tal cual)

build.mjs                el build (Node, cero dependencias)

── generado por el build (NO editar a mano) ──
index.html
menu/index.html   galeria/index.html   nosotros/index.html
catering/index.html   contacto/index.html
404.html

css/   js/                assets estáticos (se editan directo, el build no los toca)
```

## Editar

- **Cambiar el menú de navegación, el pie o los scripts:** editá el partial en `src/partials/`. Una sola vez, aplica a todas las páginas.
- **Cambiar el contenido de una página:** editá `src/pages/<pagina>.html` (solo el contenido; el encabezado y el pie los pone el build).
- **Agregar una página nueva:** creá `src/pages/nueva.html` con su bloque meta (`url: nueva/`) y agregá el enlace en `src/partials/header.html` y `footer.html`.
- Enlaces internos dentro de `src/pages/`: escribilos como `{{PREFIX}}menu/index.html`. El build pone los `../` según la profundidad.

Bloque meta de cada página:

```html
<!--
title: Menú | María Bonita
description: Explore el menú de María Bonita…
nav: menu          ← marca la pestaña activa (inicio|menu|galeria|nosotros|catering|contacto)
url: menu/          ← carpeta de salida; vacío = raíz (home)
-->
```

## Construir

```
node build.mjs        # o:  npm run build
```

Genera los HTML en la raíz. **Corré el build antes de cada commit** si tocaste `src/`.

## Publicar

El sitio se sirve desde la raíz del repo (GitHub Pages) o subiendo la carpeta a
Hostinger. Todo con rutas relativas: funciona igual en ambos y abriendo los
archivos con doble clic. En GitHub Pages, `.nojekyll` evita el procesado Jekyll.
