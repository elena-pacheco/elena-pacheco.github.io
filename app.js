// Portafolio Elena Pacheco — interacciones (lightbox de galerías y formulario de contacto)
(function () {
    // Lightbox de galería
    if (window.GALERIA_FOTOS) {
        var fotos = window.GALERIA_FOTOS;
        var nombre = window.GALERIA_NOMBRE || '';
        var abierta = null;
        var capa = null;

        function abrir(i) {
            abierta = i;
            if (!capa) {
                capa = document.createElement('div');
                capa.className = 'lightbox';
                capa.setAttribute('role', 'dialog');
                capa.setAttribute('aria-modal', 'true');
                capa.innerHTML = '<div class="lightbox-marco">'
                    + '<img alt="">'
                    + '<button type="button" class="lightbox-cerrar" aria-label="Cerrar foto ampliada">×</button>'
                    + '<button type="button" class="lightbox-flecha lightbox-prev" aria-label="Foto anterior">‹</button>'
                    + '<button type="button" class="lightbox-flecha lightbox-next" aria-label="Foto siguiente">›</button>'
                    + '</div>';
                capa.addEventListener('click', cerrar);
                capa.querySelector('.lightbox-marco').addEventListener('click', function (e) { e.stopPropagation(); });
                capa.querySelector('.lightbox-cerrar').addEventListener('click', cerrar);
                capa.querySelector('.lightbox-prev').addEventListener('click', function () { mover(-1); });
                capa.querySelector('.lightbox-next').addEventListener('click', function () { mover(1); });
                document.body.appendChild(capa);
            }
            capa.setAttribute('aria-label', 'Foto ampliada de ' + nombre);
            pintar();
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            window.setTimeout(function () {
                var im = capa && capa.querySelector('img');
                if (im) im.scrollIntoView({ block: 'center' });
            }, 40);
        }
        function pintar() {
            var img = capa.querySelector('img');
            img.src = fotos[abierta].src;
            img.alt = fotos[abierta].alt;
        }
        function mover(d) { abierta = (abierta + d + fotos.length) % fotos.length; pintar(); }
        function cerrar() {
            if (capa) { capa.remove(); capa = null; }
            abierta = null;
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        document.addEventListener('keydown', function (e) {
            if (abierta === null) return;
            if (e.key === 'Escape') cerrar();
            if (e.key === 'ArrowRight') mover(1);
            if (e.key === 'ArrowLeft') mover(-1);
        });
        document.querySelectorAll('[data-idx]').forEach(function (btn) {
            btn.addEventListener('click', function () { abrir(parseInt(btn.getAttribute('data-idx'), 10)); });
        });
    }

    // Formulario de contacto (Web3Forms)
    var form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = document.getElementById('btn-enviar');
            var ok = document.getElementById('msg-ok');
            var err = document.getElementById('msg-error');
            ok.hidden = true; err.hidden = true;
            btn.disabled = true; btn.textContent = 'Enviando…';
            var datos = new FormData(form);
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: '77bb571f-b15f-4829-a3ee-e0aca2074844',
                    subject: 'Nueva consulta desde tu portafolio',
                    nombre: datos.get('nombre'),
                    telefono: datos.get('telefono'),
                    mensaje: datos.get('mensaje')
                })
            }).then(function (res) {
                if (!res.ok) throw new Error('fallo');
                ok.hidden = false;
                form.reset();
            }).catch(function () {
                err.hidden = false;
            }).finally(function () {
                btn.disabled = false; btn.textContent = 'Enviar mensaje';
            });
        });
    }
})();

/* Layout justificado computado: cada duo (destacada + companeras) llena el ancho
   exacto; la destacada ocupa la altura combinada de las 2 subfilas de su columna;
   todas las fotos completas en su proporcion natural, sin recortes ni huecos.
   En pantallas angostas la destacada va a ancho completo y las companeras en
   filas justificadas debajo. */
(function () {
    var GAP = function () { return window.innerWidth <= 700 ? 6 : 10; };
    var HBASE = function (W) {
        if (window.innerWidth <= 700) return 130;
        return Math.min(320, Math.max(215, Math.round((W || 1248) * 0.17)));
    };

    function arDe(el) { return parseFloat(el.style.getPropertyValue('--ar')) || 1; }
    function fijar(el, w, h) { el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.flex = '0 0 auto'; }

    /* Reparte items en r filas equilibradas por proporcion y justifica cada fila al ancho W. */
    function filasParejas(items, W, g, r) {
        var total = items.reduce(function (a, it) { return a + it.ar; }, 0);
        var objetivo = total / r, filas = [], actual = [], suma = 0;
        items.forEach(function (it, i) {
            actual.push(it); suma += it.ar;
            var restantes = items.length - i - 1, filasRestantes = r - filas.length - 1;
            if (suma >= objetivo && (restantes >= filasRestantes || filasRestantes <= 0)) {
                filas.push({ items: actual, suma: suma }); actual = []; suma = 0;
            }
        });
        if (actual.length) filas.push({ items: actual, suma: suma });
        filas.forEach(function (f) {
            f.h = (W - (f.items.length - 1) * g) / f.suma;
            f.items.forEach(function (it) { fijar(it.el, it.ar * f.h, f.h); });
        });
    }

    function layoutDuo(duo, W, g, hBase) {
        var grande = duo.querySelector('.collage-foto--grande');
        var col = duo.querySelector('.collage-col');
        if (!grande || !col) return;
        var arG = arDe(grande);
        var items = Array.prototype.slice.call(col.querySelectorAll('.collage-foto'))
            .map(function (el) { return { el: el, ar: arDe(el) }; });
        if (!items.length) return;
        if (W <= 700) {
            duo.style.display = 'block';
            var hG = W / arG;
            fijar(grande, W, hG);
            grande.style.margin = '0 0 ' + g + 'px'; grande.style.display = 'block';
            col.style.display = 'flex'; col.style.flexWrap = 'wrap'; col.style.gap = g + 'px';
            var total = items.reduce(function (a, it) { return a + it.ar; }, 0);
            filasParejas(items, W, g, Math.max(1, Math.round(total * hBase / W)));
            return;
        }
        duo.style.display = 'flex'; duo.style.gap = g + 'px'; duo.style.flex = '0 0 100%';
        grande.style.margin = '0';
        col.style.display = 'flex'; col.style.flexWrap = 'wrap'; col.style.gap = g + 'px';
        col.style.alignContent = 'flex-start'; col.style.flex = '1 1 0'; col.style.minWidth = '0';
        /* Solucion exacta por corte: con R = ancho de la columna,
           hB = (W-g-R)/arG y hB = h1+g+h2 son ecuaciones lineales en R. */
        var mejor = null;
        for (var a = 1; a < items.length; a++) {
            var sA = 0, sB = 0, i;
            for (i = 0; i < a; i++) sA += items[i].ar;
            for (i = a; i < items.length; i++) sB += items[i].ar;
            var cA = (a - 1) * g, cB = (items.length - a - 1) * g;
            /* (R-cA)/sA + (R-cB)/sB + g = (W-g-R)/arG */
            var R = ((W - g) / arG - g + cA / sA + cB / sB) / (1 / sA + 1 / sB + 1 / arG);
            if (R < W * 0.28 || R > W * 0.85) continue;
            var h1 = (R - cA) / sA, h2 = (R - cB) / sB;
            var hB = h1 + g + h2;
            var score = Math.abs(h1 - h2) + 0.4 * (Math.abs(h1 - hBase) + Math.abs(h2 - hBase));
            if (h1 < hBase * 0.55 || h1 > hBase * 1.9) score += 1000;
            if (h2 < hBase * 0.55 || h2 > hBase * 1.9) score += 1000;
            if (!mejor || score < mejor.score) mejor = { a: a, h1: h1, h2: h2, hB: hB, score: score };
        }
        if (!mejor) { /* sin corte posible (una sola companera): columna en filas justificadas sin destacada al lado */
            duo.style.display = 'block';
            var hGsolo = Math.min(W / arG, hBase * 2.4);
            fijar(grande, hGsolo * arG, hGsolo);
            var tot = items.reduce(function (ac, it) { return ac + it.ar; }, 0);
            filasParejas(items, W, g, Math.max(1, Math.round(tot * hBase / W)));
            return;
        }
        fijar(grande, arG * mejor.hB, mejor.hB);
        items.slice(0, mejor.a).forEach(function (it) { fijar(it.el, it.ar * mejor.h1, mejor.h1); });
        items.slice(mejor.a).forEach(function (it) { fijar(it.el, it.ar * mejor.h2, mejor.h2); });
    }

    function layout(grid) {
        var W = grid.clientWidth;
        if (!W) return;
        var g = GAP(), hBase = HBASE(W);
        grid.style.gap = g + 'px';
        Array.prototype.forEach.call(grid.children, function (nodo) {
            if (nodo.classList.contains('collage-duo')) layoutDuo(nodo, W, g, hBase);
        });
        var sueltas = Array.prototype.slice.call(grid.querySelectorAll(':scope > .collage-foto'))
            .map(function (el) { return { el: el, ar: arDe(el) }; });
        if (sueltas.length) {
            var total = sueltas.reduce(function (a, it) { return a + it.ar; }, 0);
            filasParejas(sueltas, W, g, Math.max(1, Math.round(total * hBase / W)));
        }
    }

    function todo() {
        var grids = document.querySelectorAll('.collage-grid');
        for (var i = 0; i < grids.length; i++) layout(grids[i]);
    }
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(todo, 150); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', todo);
    else todo();
    window.addEventListener('load', todo);
})();
