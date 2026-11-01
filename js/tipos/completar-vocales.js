/* ============================================================
   TIPO DE ACTIVIDAD · "completar-vocales"
   Se ve el dibujo y debajo la palabra SIN sus vocales (P _ L _ T _).
   El chico toca la vocal que falta. Si acierta, se completa y pasa a
   la siguiente vocal; si se equivoca suena la bocina de error.

   Configuración que lee de niveles.js:
     palabras: ['pelota', 'mesa', ...]   (se usa el "texto" de cada palabra
                                          en contenido/palabras.js)
     vocales:  ['A','E','I','O','U']     (opcional: vocales que se ofrecen)
     botonSonido: true                    (opcional) parlantito sobre el dibujo
                                          que dice la palabra (voz/{id}.mp3)
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['completar-vocales'] = {

  titulo: 'Completá las vocales',
  consigna: 'Mirá el dibujo y tocá la vocal que falta',
  mensajeFinal: 'Completaste las vocales de todas las palabras.',
  icono: `<svg viewBox="0 0 24 24"><text x="12" y="16.5" font-family="Andika, sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">p_t_</text></svg>`,

  VOCALES: 'AEIOU',

  // Devuelve la vocal "base" de una letra (Á → A) o '' si no es vocal
  vocalBase(letra){
    const base = letra.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    return AS.tipos['completar-vocales'].VOCALES.includes(base) ? base : '';
  },

  montar(contenedor, actividad, api){
    const conSonido = actividad.botonSonido !== false;   // por defecto, cada dibujo tiene su parlante
    const el = AS.util.el;
    const tipo = AS.tipos['completar-vocales'];
    const palabras = actividad.palabras.map(AS.palabra);
    const vocalesOfrecidas = actividad.vocales || ['A', 'E', 'I', 'O', 'U'];

    let indice = 0;
    let huecos = [];        // { caja, vocal, letra, lleno }
    let activo = null;      // hueco seleccionado
    let ocupado = false;
    let vivo = true;
    let vozActual = null;

    const progreso = el('p', { class: 'progress-text' });
    const escenario = el('div', { class: 'word-stage' });
    const palabraEl = el('div', { class: 'word-blanks' });
    const opciones = el('div', { class: 'vowel-options' });
    vocalesOfrecidas.forEach(v => {
      opciones.appendChild(el('button', { class: 'letter-option', onclick: () => elegir(v) }, v));
    });
    contenedor.append(progreso, escenario, palabraEl, opciones);
    if (conSonido){
      contenedor.append(el('p', { class: 'help-hint' }, 'Si necesitás ayuda, escuchá la palabra'));
    }

    function cargarPalabra(i){
      const palabra = palabras[i];
      progreso.textContent = `Imagen ${i + 1} de ${palabras.length}`;
      ocupado = false;
      escenario.innerHTML = '';
      escenario.appendChild(AS.ui.imagenPalabra(palabra.id));
      if (conSonido){
        escenario.appendChild(el('button', {
          class: 'card-speaker',
          'aria-label': `Escuchar la palabra`,
          html: AS.ui.ICONO_PARLANTE_CHICO,
          onclick: () => { if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(palabra.voz); },
        }));
      }

      palabraEl.innerHTML = '';
      huecos = [];
      Array.from(palabra.texto.toUpperCase()).forEach(letra => {
        const vocal = tipo.vocalBase(letra);
        if (vocal){
          const caja = el('button', { class: 'blank-slot', 'aria-label': 'Falta una vocal' });
          const hueco = { caja, vocal, letra, lleno: false };
          caja.addEventListener('click', () => { if (!ocupado && !hueco.lleno) seleccionar(hueco); });
          huecos.push(hueco);
          palabraEl.appendChild(caja);
        } else {
          palabraEl.appendChild(el('span', { class: 'blank-letter' }, letra === ' ' ? ' ' : letra));
        }
      });
      seleccionar(huecos[0]);
    }

    function seleccionar(hueco){
      if (activo) activo.caja.classList.remove('active');
      activo = hueco || null;
      if (activo) activo.caja.classList.add('active');
    }

    function elegir(vocalElegida){
      if (ocupado || !activo) return;
      if (vocalElegida === activo.vocal){
        AS.audio.acierto();
        activo.lleno = true;
        activo.caja.textContent = activo.letra;
        activo.caja.classList.remove('active');
        activo.caja.classList.add('filled');
        const siguiente = huecos.find(h => !h.lleno);
        if (siguiente){
          seleccionar(siguiente);
        } else {
          activo = null;
          ocupado = true;
          palabraEl.classList.add('correct');
          escenario.classList.add('celebrate');
          setTimeout(() => {
            if (!vivo) return;
            palabraEl.classList.remove('correct');
            escenario.classList.remove('celebrate');
            indice++;
            if (indice >= palabras.length) api.terminar();
            else cargarPalabra(indice);
          }, 1300);
        }
      } else {
        AS.audio.bocina();
        activo.caja.classList.remove('wrong');
        void activo.caja.offsetWidth;
        activo.caja.classList.add('wrong');
        const caja = activo.caja;
        setTimeout(() => caja.classList.remove('wrong'), 500);
      }
    }

    cargarPalabra(0);
    return () => { vivo = false; if (vozActual) vozActual.pause(); };
  },
};
