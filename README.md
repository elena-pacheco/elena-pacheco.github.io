# Portafolio de Elena Pacheco — Fotografía & Video

Sitio estático (HTML + CSS + JS, sin dependencias ni build). Funciona tal cual en GitHub Pages o cualquier hosting estático.

## Publicar en GitHub Pages (paso a paso)

1. DESCARGA Y DESCOMPRIME este ZIP en tu computador. Al abrir la carpeta debes ver directamente: `index.html`, `style.css`, `app.js`, las demás páginas `.html`, `README.md` y las carpetas `photos/` y `fonts/`. NO subas el ZIP ni una carpeta contenedora: esos archivos van en la raíz del repositorio.
2. Entra a github.com con Google. Arriba a la derecha: "+" → "New repository".
3. Nombre exacto: `elena-pacheco.github.io` → Public → "Create repository".
4. En la página del repositorio vacío, toca el enlace "uploading an existing file".
5. PRIMERA TANDA: arrastra TODO menos la carpeta `photos` (los `.html`, `style.css`, `app.js`, `README.md` y la carpeta `fonts`). Baja y toca "Commit changes".
6. SEGUNDA TANDA (GitHub acepta máx. 100 archivos por carga y `photos` tiene 101): abre la carpeta `photos` en tu computador, saca 2 fotos al escritorio, arrastra la carpeta `photos` (queda con 99) y toca "Commit changes". Después entra a la carpeta `photos` dentro del repositorio, toca "Add file" → "Upload files", arrastra las 2 fotos que sacaste y confirma. Así todas quedan dentro de `photos/` y la web las encuentra.
7. ACTIVA LA PÁGINA: Settings → Pages → "Source": "Deploy from a branch" → Branch: `main`, carpeta `/(root)` → Save. Espera unos minutos: tu sitio debería quedar en https://elena-pacheco.github.io (dirección esperada; se confirma cuando cargue).
8. PRUEBA el formulario de contacto con un envío real para confirmar que llega a tu correo.

Si algo falla en cualquier paso, escríbeme por WhatsApp y lo vemos.

## Estructura

- `index.html` — portada (hero, colección destacada, sobre mí, contacto).
- `eventos.html`, `moda.html`, `parejas-y-familia.html`, `productos.html`, `retrato-corporativo.html` — una página por categoría.
- `style.css` — todos los estilos (tipografía Quicksand, colores, grillas).
- `app.js` — lightbox de las galerías y envío del formulario.
- `photos/` — las fotos optimizadas para web.
- `fonts/` — la tipografía Quicksand (4 archivos woff2).

## Editar

- Textos: se editan directo en cada `.html` (busca el texto actual y reemplázalo).
- Fotos: reemplaza el archivo en `photos/` con el MISMO nombre, o agrega una línea nueva en la galería del `.html` correspondiente copiando una existente.
- Colores y tamaños: al inicio de `style.css` están las variables (`--grafito`, `--ambar`, etc.).
- Formulario de contacto: ya está conectado al servicio Web3Forms con una clave creada para tu correo (elenabelen.ep@gmail.com); no necesita servidor propio. Cuando el sitio esté publicado, haz un envío de prueba para confirmar que los mensajes llegan a tu correo.

## Notas

- La categoría Video existe en tu material pero quedó oculta del menú, como acordamos.
- El sitio queda indexable en Google al estar en GitHub Pages (sin el noindex del visor anterior).
