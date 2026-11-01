/* ============================================================
   TIPO DE ACTIVIDAD · "unir-igual"
   Arrastrar cada tarjeta de la izquierda hasta la de la derecha
   que empieza con la misma letra. Se valida por LETRA (no por una
   pareja fija), así que si hay varias palabras con la misma inicial
   cualquier combinación correcta cuenta.

   Configuración que lee de niveles.js:
     izquierda: ['rojo', 'verde', ...]
     derecha:   ['rosa', 'violeta', ...]
     tarjetasGrandes: true   (opcional) tarjetas más altas, para que las
                              imágenes se vean bien
     derechaLetras: ['A','E','I','O','U']   (opcional) en lugar de "derecha"
                              (con botonSonido, cada letra también tiene su
                              parlantito: suena sounds/{letra}.mp3):
                              la columna derecha muestra LETRAS MAYÚSCULAS DE
                              IMPRENTA y cada imagen de la izquierda se une con
                              la letra de su sonido inicial. Las letras quedan
                              en el orden en que se escriben acá. Se pueden repetir
                              letras ('T','C','P','T'...). Si una letra tiene dos sonidos
                              se escribe { letra: 'C', sonido: 'ca-co-cu' }
                              (suena sounds/ca-co-cu.mp3).
     derechaPalabras: ['bruja', 'tren', ...]   (opcional) en lugar de "derecha":
                              la columna derecha muestra la PALABRA ESCRITA en
                              mayúsculas de imprenta (ids de palabras.js). Cada imagen
                              de la izquierda se une con SU palabra (se valida la
                              palabra completa, no solo la inicial). Con botonSonido,
                              cada palabra tiene su parlantito (voz/{id}.mp3).
     botonSonido: true       (opcional) cada tarjeta muestra un botoncito
                              de parlante; al tocarlo suena la palabra
                              (voz/{id}.mp3). Arrastrar NUNCA hace sonar.
   Cada elemento sale de contenido/palabras.js: si tiene "color" se
   muestra como un cuadro de color; si no, con su imagen.
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['unir-igual'] = {

  titulo: '¿Cuál empieza igual?',
  consigna: 'Arrastrá cada tarjeta hasta la que empieza con la misma letra',
  mensajeFinal: 'Uniste todo lo que empieza con la misma letra.',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="7" cy="8" r="3"/><circle cx="17" cy="16" r="3"/><path d="M9.5 9.5l5 5" stroke-dasharray="2 2"/></svg>`,

  montar(contenedor, actividad, api){
    const conSonido = actividad.botonSonido !== false;   // por defecto, cada imagen tiene su parlante
    const el = AS.util.el;
    const izquierda = actividad.izquierda.map(AS.palabra);
    const letras = actividad.derechaLetras || null;
    const palabrasEscritas = actividad.derechaPalabras ? actividad.derechaPalabras.map(AS.palabra) : null;
    const derecha = letras ? letras : (palabrasEscritas || actividad.derecha.map(AS.palabra));
    const total = Math.min(izquierda.length, derecha.length);

    let unidos = 0;
    let tarjetaArrastrada = null;
    let inicialArrastrada = null;
    let desplazamientoX = 0, desplazamientoY = 0;
    let inicioX = 0, inicioY = 0, palabraArrastrada = null, marcador = null;
    let vozActual = null;

    const progreso = el('p', { class: 'match-progress' }, `0 de ${total} parejas`);
    const colIzq = el('div', { class: 'match-column left' });
    const colDer = el('div', { class: 'match-column right' });
    contenedor.append(progreso, el('div', { class: 'match-board' + (actividad.tarjetasGrandes ? ' grande' : '') }, colIzq, colDer));
    if (conSonido){
      contenedor.append(el('p', { class: 'help-hint' }, (actividad.derechaLetras || palabrasEscritas)
        ? 'Si necesitás ayuda, tocá el parlante y escuchá la palabra o el sonido de la letra'
        : 'Si necesitás ayuda, tocá el parlante y escuchá la palabra'));
    }

    // Dice la palabra en voz alta (solo desde el botoncito de parlante)
    function decir(palabra){
      if (vozActual) vozActual.pause();
      vozActual = AS.audio.reproducir(palabra.voz);
    }

    function crearBotonSonido(palabra){
      return el('button', {
        class: 'card-speaker',
        'aria-label': `Escuchar ${palabra.texto}`,
        html: AS.ui.ICONO_PARLANTE_CHICO,
        // el botón no inicia el arrastre de la tarjeta
        onpointerdown: e => e.stopPropagation(),
        onclick: e => { e.stopPropagation(); decir(palabra); },
      });
    }

    // Tarjeta con la PALABRA ESCRITA (mayúsculas de imprenta) + su parlantito
    function crearTarjetaPalabra(palabra){
      const tarjeta = el('div', { class: 'match-card letra palabra-escrita', 'aria-label': `Palabra ${palabra.texto}` },
        el('span', { class: 'letra-grande palabra' }, palabra.texto.toUpperCase()));
      tarjeta.dataset.inicial = palabra.texto.toUpperCase();   // se valida la palabra completa
      if (conSonido) tarjeta.appendChild(crearBotonSonido(palabra));
      return tarjeta;
    }

    function crearTarjeta(palabra){
      const tarjeta = el('div', { class: 'match-card' });
      tarjeta.dataset.inicial = palabra.inicial;
      if (palabra.color) tarjeta.style.background = palabra.color;
      else tarjeta.appendChild(AS.ui.imagenPalabra(palabra.id));
      if (conSonido) tarjeta.appendChild(crearBotonSonido(palabra));
      return tarjeta;
    }

    AS.util.mezclar(izquierda).forEach(palabra => {
      const tarjeta = crearTarjeta(palabra);
      tarjeta.addEventListener('pointerdown', e => empezarArrastre(e, tarjeta, palabra));
      colIzq.appendChild(tarjeta);
    });
    if (letras){
      letras.forEach(item => {
        // Cada letra puede ser 'T' o { letra: 'C', sonido: 'ca-co-cu' } (cuando una
        // misma letra tiene dos sonidos: se usa sounds/{sonido}.mp3)
        const letra = typeof item === 'string' ? item : item.letra;
        const archivoSonido = (typeof item === 'string' ? item : (item.sonido || item.letra)).toLowerCase();
        const tarjeta = el('div', { class: 'match-card letra', 'aria-label': `Letra ${letra}` }, el('span', { class: 'letra-grande' }, letra));
        tarjeta.dataset.inicial = letra.toUpperCase();
        // Parlantito de la letra: suena su sonido (sounds/{letra}.mp3)
        if (conSonido){
          tarjeta.appendChild(el('button', {
            class: 'card-speaker',
            'aria-label': `Escuchar el sonido de la letra ${letra}`,
            html: AS.ui.ICONO_PARLANTE_CHICO,
            onclick: e => { e.stopPropagation(); if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(`sounds/${archivoSonido}.mp3`); },
          }));
        }
        colDer.appendChild(tarjeta);
      });
    } else {
      AS.util.mezclar(derecha).forEach(palabra => colDer.appendChild(palabrasEscritas ? crearTarjetaPalabra(palabra) : crearTarjeta(palabra)));
    }

    function empezarArrastre(e, tarjeta, palabra){
      if (tarjeta.classList.contains('matched')) return;
      e.preventDefault();
      const caja = tarjeta.getBoundingClientRect();
      tarjetaArrastrada = tarjeta;
      inicialArrastrada = palabrasEscritas ? palabra.texto.toUpperCase() : palabra.inicial;
      palabraArrastrada = palabra;
      inicioX = e.clientX; inicioY = e.clientY;

      // Deja un hueco punteado donde estaba la tarjeta para que las demás no se muevan
      marcador = el('div', { class: 'match-card slot-empty' });
      tarjeta.parentNode.insertBefore(marcador, tarjeta);
      desplazamientoX = e.clientX - caja.left;
      desplazamientoY = e.clientY - caja.top;

      tarjeta.style.setProperty('--drag-w', `${caja.width}px`);
      tarjeta.style.left = `${caja.left}px`;
      tarjeta.style.top = `${caja.top}px`;
      tarjeta.classList.add('dragging');
      tarjeta.setPointerCapture(e.pointerId);
      tarjeta.addEventListener('pointermove', moverArrastre);
      tarjeta.addEventListener('pointerup', soltar);
      tarjeta.addEventListener('pointercancel', soltar);
    }

    function moverArrastre(e){
      if (!tarjetaArrastrada) return;
      tarjetaArrastrada.style.left = `${e.clientX - desplazamientoX}px`;
      tarjetaArrastrada.style.top = `${e.clientY - desplazamientoY}px`;
    }

    function devolverALugar(tarjeta){
      if (marcador){ marcador.remove(); marcador = null; }
      tarjeta.classList.remove('dragging');
      tarjeta.style.position = '';
      tarjeta.style.left = '';
      tarjeta.style.top = '';
    }

    function soltar(e){
      if (!tarjetaArrastrada) return;
      const tarjeta = tarjetaArrastrada;
      tarjeta.removeEventListener('pointermove', moverArrastre);
      tarjeta.removeEventListener('pointerup', soltar);
      tarjeta.removeEventListener('pointercancel', soltar);

      // Si casi no se movió, fue un toque (no un arrastre): no pasa nada
      if (Math.hypot(e.clientX - inicioX, e.clientY - inicioY) < 8){
        devolverALugar(tarjeta);
        tarjetaArrastrada = null;
        return;
      }

      tarjeta.style.visibility = 'hidden';
      const debajo = document.elementFromPoint(e.clientX, e.clientY);
      tarjeta.style.visibility = 'visible';

      const destino = debajo ? debajo.closest('.match-card') : null;
      const destinoValido = destino && colDer.contains(destino) && !destino.classList.contains('matched');

      if (destinoValido && destino.dataset.inicial === inicialArrastrada){
        devolverALugar(tarjeta);
        tarjeta.classList.add('matched');
        destino.classList.add('matched');
        AS.audio.acierto();
        unidos++;
        progreso.textContent = `${unidos} de ${total} parejas`;
        if (unidos >= total) setTimeout(() => { if (progreso.isConnected) api.terminar(); }, 900);
      } else {
        if (destino) AS.audio.error();
        devolverALugar(tarjeta);
        tarjeta.classList.add('snap-wrong');
        setTimeout(() => tarjeta.classList.remove('snap-wrong'), 300);
      }
      tarjetaArrastrada = null;
    }
  },
};
