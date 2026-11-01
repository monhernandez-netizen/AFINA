/* ============================================================
   NÚCLEO · piezas visuales que se repiten en las actividades
   ============================================================ */
window.AS = window.AS || {};

AS.ui = (function(){
  const el = AS.util.el;

  const ICONO_PARLANTE_GRANDE = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V9a2 2 0 0 1 2-2h2l5-4v18l-5-4H6a2 2 0 0 1-2-2Z"/><path d="M17.5 8.5a5 5 0 0 1 0 7"/></svg>`;
  const ICONO_PARLANTE_CHICO  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V9a2 2 0 0 1 2-2h2l5-4v18l-5-4H6a2 2 0 0 1-2-2Z"/><path d="M17.5 8.5a5 5 0 0 1 0 7"/></svg>`;

  // Título + consigna + botoncito que lee todo en voz alta.
  // Si existe la grabación consignas/{id de la actividad}.mp3 suena esa;
  // si todavía no está grabada, lee el texto con la voz del navegador.
  // Como todavía no saben leer, el botón no depende de un audio grabado:
  // usa la síntesis de voz del navegador para leer el texto tal cual está
  // escrito en niveles.js (si se edita, la lectura se actualiza sola, sin
  // grabar nada de nuevo). Lee solamente la consigna (lo que hay que hacer), no el título.
  function encabezado(nivel, actividad, tipo){
    const consigna = actividad.consigna || tipo.consigna || '';
    const titulo = actividad.titulo || tipo.titulo;
    // Se lee SOLO lo que hay que hacer (la consigna), sin el título de la actividad,
    // para que los chicos no se confundan.
    // (consignaVoz permite leer algo más, por ejemplo la pregunta del título.)
    const textoCompleto = actividad.consignaVoz || tipo.consignaVoz || consigna;
    const fila = el('div', { class: 'instruction-row' },
      el('p', {}, consigna),
      el('button', {
        class: 'instruction-speaker',
        'aria-label': 'Escuchar la consigna',
        html: ICONO_PARLANTE_CHICO,
        onclick: () => AS.audio.leerConsigna(`consignas/${actividad.id}.mp3`, textoCompleto),
      })
    );
    const cabecera = el('header', {}, el('h1', {}, `${nivel.titulo} · ${titulo}`), fila);
    // Ayuda: teclado de letras desplegable (no hace falta en la actividad que ya ES el teclado)
    if (actividad.tipo !== 'sonido-letras' && actividad.ayudaTeclado !== false){
      const ayuda = teclado(nivel);
      // El botón va arriba a la derecha (lejos del parlante de la consigna)
      cabecera.appendChild(ayuda.boton);
      cabecera.appendChild(ayuda.panel);
    }
    return cabecera;
  }

  // ---------- Teclado de ayuda (desplegable) ----------
  // Botón con dibujo de teclado, arriba a la derecha (lejos del parlante).
  // Abre un panel abajo con TODO el abecedario, pero suenan solo las letras
  // que el nivel tiene habilitadas (nivel.teclado en niveles.js):
  //   Nivel 1 vocales · Nivel 2 + prolongables · Nivel 3 + explosivas · Nivel 4 todas.
  // Las demás se ven apagadas. Al tocar una tecla suena el SONIDO de la letra.
  // La C es una tecla del mismo tamaño que las demás pero partida en dos:
  // "ce-ci" (suena como la S → prolongable) y "ca-co-cu" (explosiva).
  // Nada suena solo: ni al abrir el panel ni al cargar la actividad.
  const ICONO_TECLADO = `<svg viewBox="0 0 32 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="2.5" width="29" height="17" rx="3.5"/><path d="M6 7.5h1.5M10.5 7.5H12M15 7.5h2M20 7.5h1.5M24.5 7.5H26M6 11.5h1.5M10.5 11.5H12M15 11.5h2M20 11.5h1.5M24.5 11.5H26M9 15.5h14"/></svg>`;

  function teclado(nivel){
    const habilitados = nivel && nivel.teclado ? nivel.teclado : 'todas';
    const suena = grupo => habilitados === 'todas' || habilitados.includes(grupo);
    const SONIDO_CE_CI = 's';        // ce-ci suena igual que la S
    const SONIDO_CA_CO_CU = 'ca-co-cu';
    let audioActual = null;
    function sonar(archivo){
      if (audioActual){ audioActual.pause(); audioActual = null; }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      audioActual = AS.audio.reproducir(`sounds/${archivo}.mp3`);
    }
    function tecla(letra){
      const grupo = AS.grupoDeLetra(letra.id);
      const activa = suena(grupo);
      const clases = ['ayuda-key'];
      if (grupo === 'vocal') clases.push('is-vowel');
      if (letra.tipo === 'digraph') clases.push('is-digraph');
      if (!activa) clases.push('is-off');
      return el('button', {
        class: clases.join(' '),
        'aria-label': `Sonido de ${letra.texto}`,
        disabled: activa ? false : true,
        onclick: () => sonar(letra.id),
      }, letra.texto);
    }

    const grilla = el('div', { class: 'ayuda-grid' });
    AS.letras.forEach(letra => {
      if (letra.id === 'c'){
        const ceciOn = suena('prolongable'), cacocuOn = suena('explosiva');
        grilla.appendChild(el('div', { class: 'ayuda-key ayuda-c' },
          el('button', { class: 'mitad' + (ceciOn ? '' : ' is-off'), disabled: ceciOn ? false : true,
              'aria-label': 'Sonido de ce, ci', onclick: () => sonar(SONIDO_CE_CI) },
            el('span', {}, 'ce'), el('span', {}, 'ci')),
          el('button', { class: 'mitad' + (cacocuOn ? '' : ' is-off'), disabled: cacocuOn ? false : true,
              'aria-label': 'Sonido de ca, co, cu', onclick: () => sonar(SONIDO_CA_CO_CU) },
            el('span', {}, 'ca'), el('span', {}, 'co'), el('span', {}, 'cu'))
        ));
        return;
      }
      grilla.appendChild(tecla(letra));
    });

    const panel = el('div', { class: 'ayuda-panel', hidden: 'hidden' },
      el('button', { class: 'ayuda-cerrar', 'aria-label': 'Cerrar el teclado', onclick: () => alternar(false) }, '×'),
      grilla
    );
    const boton = el('button', {
      class: 'instruction-keyboard',
      'aria-label': 'Abrir el teclado de letras',
      'aria-expanded': 'false',
      html: ICONO_TECLADO,
      onclick: () => alternar(),
    });

    function alternar(abrir){
      const abierto = abrir === undefined ? panel.hasAttribute('hidden') : abrir;
      if (abierto) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', 'hidden');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      boton.classList.toggle('is-open', abierto);
      document.body.classList.toggle('con-ayuda-teclado', !!document.querySelector('.ayuda-panel:not([hidden])'));
    }
    return { boton, panel };
  }

  // ---------- Ícono de una actividad ----------
  // Un mosaico con las imágenes (o letras / palabras) de ESA actividad, para
  // que el ícono diga de qué se trata. Si hace falta, se puede reemplazar con
  // un ícono propio: campo `icono` (HTML/SVG) de la actividad en niveles.js.
  function iconoActividad(actividad, tipo){
    if (actividad.icono) return el('span', { class: 'level-icon', html: actividad.icono });
    const ids = [];
    const agregar = lista => (lista || []).forEach(x => { if (x && !ids.includes(x)) ids.push(x); });
    agregar(actividad.izquierda);
    agregar(actividad.palabras);
    agregar((actividad.rondas || []).map(r => (r.correctas || [])[0]));
    if (!ids.length) agregar(actividad.derecha);
    const fichas = [];
    (actividad.derechaLetras || []).forEach(l => fichas.push(typeof l === 'string' ? l : l.letra));
    if (!fichas.length && actividad.derechaPalabras)
      actividad.derechaPalabras.forEach(id => fichas.push(AS.palabra(id).texto.toUpperCase()));
    if (!fichas.length && actividad.letras && !ids.length)
      actividad.letras.forEach(id => { const l = AS.letras.find(x => x.id === id); if (l) fichas.push(l.texto); });

    const celdas = [];
    const nImgs = fichas.length && ids.length ? 2 : Math.min(4, ids.length);
    ids.slice(0, nImgs).forEach(id => {
      const img = el('img', { alt: '', src: AS.palabra(id).imagen, loading: 'lazy' });
      img.addEventListener('error', () => img.remove());
      celdas.push(el('span', { class: 'ico-cel' }, img));
    });
    if (fichas.length && fichas[0].length > 2){
      // Palabra escrita: una sola, a lo ancho (se lee mejor que dos chiquitas)
      celdas.push(el('span', { class: 'ico-cel ico-ficha larga' }, fichas[0]));
    } else {
      fichas.slice(0, 4 - celdas.length).forEach(f => celdas.push(el('span', { class: 'ico-cel ico-ficha' }, f)));
    }
    if (!celdas.length) return el('span', { class: 'level-icon', html: tipo.icono || '' });
    return el('span', { class: 'level-icon act-icon' }, ...celdas);
  }

  // Botoncito de parlante para tarjetas (lee un audio; si falta, la voz del navegador).
  // No abre la tarjeta: solo suena.
  function parlanteTarjeta(ruta, texto, etiqueta){
    return el('button', {
      class: 'card-speaker',
      'aria-label': etiqueta || 'Escuchar',
      html: ICONO_PARLANTE_CHICO,
      onclick: e => { e.stopPropagation(); AS.audio.leerConsigna(ruta, texto); },
      onkeydown: e => e.stopPropagation(),
    });
  }

  // Fila "texto + parlante" para las indicaciones de las pantallas de inicio y menú
  function indicacion(texto, ruta){
    return el('div', { class: 'instruction-row indicacion' },
      el('p', {}, texto),
      el('button', { class: 'instruction-speaker', 'aria-label': 'Escuchar la indicación',
        html: ICONO_PARLANTE_CHICO, onclick: () => AS.audio.leerConsigna(ruta, texto) })
    );
  }

  // Botón "Volver": se ve como un botón (con borde, flecha o casita y texto) y
  // tiene su parlante al lado para que se escuche qué dice.
  //   icono: 'casa' (volver al inicio) o 'flecha' (volver a la pantalla anterior)
  const ICONO_FLECHA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>`;
  const ICONO_CASA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>`;
  function botonVolver(texto, alHacerClick, opciones){
    const o = opciones || {};
    return el('div', { class: 'back-row' },
      el('button', { class: 'back-btn', onclick: alHacerClick },
        el('span', { class: 'back-ico', html: o.icono === 'casa' ? ICONO_CASA : ICONO_FLECHA }),
        el('span', {}, texto)),
      el('button', { class: 'instruction-speaker', 'aria-label': 'Escuchar: ' + texto, html: ICONO_PARLANTE_CHICO,
        onclick: () => AS.audio.leerConsigna(o.audio || '', texto) })
    );
  }

  // Imagen de una palabra. Si el archivo todavía no existe,
  // muestra un cuadro punteado con el nombre de la palabra.
  function imagenPalabra(idPalabra){
    const palabra = AS.palabra(idPalabra);
    const contenedor = el('span', { style: { display: 'contents' } });
    const img = el('img', { alt: '', src: palabra.imagen, class: palabra.llenar ? 'llena' : '' });
    img.addEventListener('error', () => {
      contenedor.innerHTML = '';
      contenedor.appendChild(el('span', { class: 'sin-imagen' }, palabra.texto));
    });
    contenedor.appendChild(img);
    return contenedor;
  }

  return { ICONO_PARLANTE_GRANDE, ICONO_PARLANTE_CHICO, encabezado, botonVolver, imagenPalabra, iconoActividad, parlanteTarjeta, indicacion };
})();

/* ============================================================
   NÚCLEO · efectos de festejo (para que los chicos se sientan premiados)
   - estrellitas(): lluvia de estrellitas donde se tocó (cada acierto).
   - confeti():     lluvia de confeti en toda la pantalla (al terminar).
   Los sonidos de festejo están en audio.js (acierto / fanfarria).
   Si la persona tiene activado "reducir movimiento", no se anima nada.
   ============================================================ */
AS.efectos = (function(){
  const el = AS.util.el;
  let ultimo = null; // última posición tocada (para saber dónde festejar)
  ['pointerdown', 'pointerup'].forEach(tipo =>
    document.addEventListener(tipo, e => { ultimo = { x: e.clientX, y: e.clientY }; }, true));

  function sinMovimiento(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function capa(){
    const c = el('div', { class: 'efecto-capa', 'aria-hidden': 'true' });
    document.body.appendChild(c);
    return c;
  }

  const ESTRELLAS = ['⭐', '✨', '🌟', '💫'];
  function estrellitas(){
    if (sinMovimiento()) return;
    const origen = ultimo || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const c = capa();
    for (let i = 0; i < 14; i++){
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 50 + Math.random() * 70;
      const p = el('span', { class: 'chispa' }, ESTRELLAS[i % ESTRELLAS.length]);
      p.style.left = origen.x + 'px';
      p.style.top = origen.y + 'px';
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist - 20 + 'px');
      p.style.fontSize = 14 + Math.random() * 14 + 'px';
      c.appendChild(p);
    }
    setTimeout(() => c.remove(), 1200);
  }

  const COLORES = ['#56A42C', '#05A3C8', '#F5B731', '#E8734E', '#C65BCF', '#FF6F91'];
  function confeti(){
    if (sinMovimiento()) return;
    const c = capa();
    for (let i = 0; i < 90; i++){
      const p = el('span', { class: 'confeti' });
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = COLORES[i % COLORES.length];
      p.style.width = 6 + Math.random() * 8 + 'px';
      p.style.height = 8 + Math.random() * 10 + 'px';
      p.style.animationDelay = Math.random() * 1.2 + 's';
      p.style.animationDuration = 2.2 + Math.random() * 1.8 + 's';
      p.style.setProperty('--giro', (Math.random() * 720 - 360) + 'deg');
      p.style.setProperty('--vaiven', (Math.random() * 120 - 60) + 'px');
      c.appendChild(p);
    }
    setTimeout(() => c.remove(), 5200);
  }

  return { estrellitas, confeti };
})();
