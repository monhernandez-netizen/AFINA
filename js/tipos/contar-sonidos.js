/* ============================================================
   TIPO DE ACTIVIDAD · "contar-sonidos"
   Se ve un dibujo y el chico toca una vez por cada sonido de la
   palabra. Un botón grande con manito y la palabra "Tocá" suma un
   sonido cada vez; arriba aparecen puntitos (sin números). La palabra se escucha tocando el parlantito que
   está sobre el dibujo (igual que en las demás actividades): suena la
   versión estirada (ayuda/{id}.mp3), que ayuda a contar los sonidos; si esa
   no existe, suena el nombre normal (voz/{id}.mp3). Ya no hay botón
   "Ayuda" aparte.

   Configuración que lee de niveles.js:
       palabras: ['pato', 'mesa', ...]   (cada una necesita "sonidos"
                                        en contenido/palabras.js)
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

// Manito que toca (ícono del botón "Tocá")
const ICONO_MANO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10"/><path d="M12 9.5a1.5 1.5 0 0 1 3 0V11"/><path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-4-2L4.5 15.2a1.6 1.6 0 0 1 2.5-2L9 15"/></svg>`;

AS.tipos['contar-sonidos'] = {

  titulo: '¿Cuántos sonidos tiene la palabra?',
  consigna: 'Mirá el dibujo y tocá el botón una vez por cada sonido',
  // Lo que se LEE en voz alta (incluye la pregunta del título; ver consignas/):
  consignaVoz: '¿Cuántos sonidos tiene la palabra? Mirá el dibujo y tocá el botón una vez por cada sonido',
  mensajeFinal: 'Contaste los sonidos de todas las palabras.',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="8" cy="9" r="1.6"/><path d="m3 14 4.5-4 4 3.5L17 9l4 5"/>
    <circle cx="7" cy="20" r="1.4" fill="#fff" stroke="none"/><circle cx="12" cy="20" r="1.4" fill="#fff" stroke="none"/><circle cx="17" cy="20" r="1.4" fill="#fff" stroke="none"/></svg>`,

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const palabras = actividad.palabras.map(AS.palabra);

    let indice = 0;
    let toques = 0;
    let ocupado = false;   // bloquea toques durante la animación de feedback
    let vozActual = null;
    let vivo = true;       // se apaga al salir de la pantalla

    const progreso = el('p', { class: 'progress-text' });
    const escenario = el('div', { class: 'word-stage' });
    // Botón grande "TOCÁ" con una manito. Sin número: arriba van solo
    // puntitos (uno por toque) para que "Borrar" tenga un efecto visible.
    const puntos = el('div', { class: 'dots-row' });
    const botonToque = el('button', {
      class: 'count-tap', 'aria-label': 'Tocar una vez por cada sonido',
      html: ICONO_MANO + '<span>Tocá</span>',
      onclick: tocar,
    });
    const botonBorrar = el('button', { class: 'action-btn', onclick: borrar }, 'Borrar');
    const botonListo = el('button', { class: 'action-btn primary', onclick: confirmar }, 'Listo ✓');

    const TEXTO_TOCAR = 'Tocá el botón: 1, 2, 3… una vez por cada sonido';
    const RUTA_TOCAR = 'consignas/contar-sonidos-tocar.mp3';

    contenedor.append(
      progreso, escenario,
      puntos,
      el('div', { class: 'count-row' }, botonToque),
      el('div', { class: 'instruction-row tap-hint-row' },
        el('p', { class: 'tap-hint' }, TEXTO_TOCAR),
        el('button', { class: 'instruction-speaker', 'aria-label': 'Escuchar la indicación',
          html: AS.ui.ICONO_PARLANTE_CHICO, onclick: () => AS.audio.leerConsigna(RUTA_TOCAR, TEXTO_TOCAR) })
      ),
      el('div', { class: 'action-row' }, botonBorrar, botonListo)
    );

    function cargarPalabra(i){
      const palabra = palabras[i];
      progreso.textContent = `Imagen ${i + 1} de ${palabras.length}`;
      toques = 0;
      ocupado = false;
      puntos.classList.remove('correct', 'wrong');
      dibujarPuntos();
      escenario.innerHTML = '';
      escenario.appendChild(AS.ui.imagenPalabra(palabra.id));
      // Parlantito sobre el dibujo: dice la palabra estirada (ayuda/{id}.mp3);
      // si no está grabada, el nombre normal (voz/{id}.mp3)
      escenario.appendChild(el('button', {
        class: 'card-speaker',
        'aria-label': 'Escuchar la palabra',
        html: AS.ui.ICONO_PARLANTE_CHICO,
        onclick: () => { if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(palabra.ayuda || palabra.voz); },
      }));
    }

    function dibujarPuntos(){
      puntos.innerHTML = '';
      for (let i = 0; i < toques; i++) puntos.appendChild(el('span', { class: 'dot' }));
    }

    function tocar(){
      if (ocupado) return;
      toques++;
      dibujarPuntos();
      AS.audio.tic();
    }

    function borrar(){
      if (ocupado || toques === 0) return;
      toques--;
      dibujarPuntos();
    }

    function confirmar(){
      if (ocupado) return;
      const palabra = palabras[indice];
      ocupado = true;

      if (toques === palabra.sonidos){
        AS.audio.acierto();
        puntos.classList.add('correct');
        escenario.classList.add('celebrate');
        setTimeout(() => {
          if (!vivo) return;
          escenario.classList.remove('celebrate');
          indice++;
          if (indice >= palabras.length) api.terminar();
          else cargarPalabra(indice);
        }, 1200);
      } else {
        AS.audio.error();
        puntos.classList.add('wrong');
        escenario.classList.add('shake');
        setTimeout(() => {
          if (!vivo) return;
          escenario.classList.remove('shake');
          puntos.classList.remove('wrong');
          toques = 0;
          dibujarPuntos();
          ocupado = false;
        }, 900);
      }
    }

    cargarPalabra(0);
    return () => { vivo = false; if (vozActual) vozActual.pause(); };
  },
};
