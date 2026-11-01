/* ============================================================
   TIPO DE ACTIVIDAD · "escribir-palabra"
   Se ve el dibujo y el chico escribe la palabra tocando las letras del
   tablero (o con el teclado de la compu). Cada letra se controla al
   momento: si acierta, entra en su casillero; si se equivoca suena la
   bocina y esa tecla se apaga hasta que acierte la letra siguiente
   (así se va descartando). No hay audio que arranque solo.

   Configuración que lee de niveles.js:
     palabras: ['jaula', 'taza', ...]   (se usa el "texto" de cada palabra
                                         en contenido/palabras.js)
     cajas: true     (opcional, por defecto true) muestra una caja por cada
                     letra: la cantidad justa para escribir la palabra.
                     Con false se ve solo una línea, sin pista de cuántas
                     letras son.
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['escribir-palabra'] = {

  titulo: 'Escribí la palabra',
  consigna: 'Mirá el dibujo y escribí la palabra',
  mensajeFinal: 'Escribiste todas las palabras.',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>`,

  // "ñ" se conserva; los acentos se ignoran (á = a)
  normalizar(letra){
    return letra.toUpperCase().replace('Ñ', '#').normalize('NFD').replace(/[̀-ͯ]/g, '').replace('#', 'Ñ');
  },

  ABECEDARIO: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''),

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const tipo = AS.tipos['escribir-palabra'];
    const palabras = actividad.palabras.map(AS.palabra);
    const conCajas = actividad.cajas !== false;

    let indice = 0;
    let letras = [];       // letras de la palabra actual (normalizadas)
    let cajas = [];
    let posicion = 0;      // próxima letra a escribir
    let ocupado = false;
    let vivo = true;

    const progreso = el('p', { class: 'progress-text' });
    const escenario = el('div', { class: 'word-stage' });
    const palabraEl = el('div', { class: 'write-word' + (conCajas ? '' : ' sin-cajas') });
    const teclado = el('div', { class: 'write-keys' });
    const botones = {};
    tipo.ABECEDARIO.forEach(l => {
      const b = el('button', { class: 'write-key', 'aria-label': `Letra ${l}`, onclick: () => elegir(l) }, l);
      botones[l] = b;
      teclado.appendChild(b);
    });
    contenedor.append(progreso, escenario, palabraEl, teclado,
      el('p', { class: 'help-hint' }, 'Si necesitás ayuda, escuchá la palabra'));
    let vozActual = null;

    function cargarPalabra(i){
      const palabra = palabras[i];
      progreso.textContent = `Imagen ${i + 1} de ${palabras.length}`;
      ocupado = false;
      posicion = 0;
      escenario.innerHTML = '';
      escenario.classList.remove('celebrate');
      escenario.appendChild(AS.ui.imagenPalabra(palabra.id));
      escenario.appendChild(el('button', {
        class: 'card-speaker',
        'aria-label': 'Escuchar la palabra',
        html: AS.ui.ICONO_PARLANTE_CHICO,
        onclick: () => { if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(palabra.voz); },
      }));

      letras = Array.from(palabra.texto).filter(c => c !== ' ').map(tipo.normalizar);
      palabraEl.classList.remove('correct');
      palabraEl.innerHTML = '';
      cajas = letras.map(() => {
        const c = el('span', { class: 'write-box' });
        palabraEl.appendChild(c);
        return c;
      });
      habilitarTodas();
      marcarActiva();
    }

    function habilitarTodas(){
      Object.values(botones).forEach(b => { b.disabled = false; b.classList.remove('wrong'); });
    }

    function marcarActiva(){
      cajas.forEach((c, k) => c.classList.toggle('active', k === posicion));
    }

    function elegir(letra){
      if (ocupado || posicion >= letras.length) return;
      if (letra === letras[posicion]){
        AS.audio.acierto();
        const caja = cajas[posicion];
        caja.textContent = letra;
        caja.classList.add('filled');
        caja.classList.remove('active', 'wrong');
        posicion++;
        habilitarTodas();
        if (posicion >= letras.length){
          ocupado = true;
          palabraEl.classList.add('correct');
          escenario.classList.add('celebrate');
          setTimeout(() => {
            if (!vivo) return;
            indice++;
            if (indice >= palabras.length) api.terminar();
            else cargarPalabra(indice);
          }, 1400);
        } else {
          marcarActiva();
        }
      } else {
        AS.audio.bocina();
        const b = botones[letra];
        b.disabled = true;
        b.classList.add('wrong');
        const caja = cajas[posicion];
        caja.classList.remove('wrong');
        void caja.offsetWidth;
        caja.classList.add('wrong');
        setTimeout(() => caja.classList.remove('wrong'), 450);
      }
    }

    // Teclado físico (compu)
    function alApretar(e){
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const l = tipo.normalizar(e.key);
      if (botones[l] && !botones[l].disabled) elegir(l);
    }
    document.addEventListener('keydown', alApretar);

    cargarPalabra(0);
    return () => { vivo = false; if (vozActual) vozActual.pause(); document.removeEventListener('keydown', alApretar); };
  },
};
