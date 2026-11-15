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
