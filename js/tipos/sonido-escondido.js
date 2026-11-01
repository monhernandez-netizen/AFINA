/* ============================================================
   TIPO DE ACTIVIDAD · "sonido-escondido"
   Suena un sonido (letra) y aparecen varias imágenes juntas. El
   chico tiene que tocar las que tienen ese sonido escondido en
   cualquier parte de la palabra (al principio, en el medio o al
   final), no solo al principio como en "letra inicial". El sonido
   no arranca solo: hay que tocar el parlante.

   Configuración que lee de niveles.js:
     rondas: [
       { letra: 's', correctas: ['sol', 'mesa', 'oso'], incorrectas: ['banana', 'mono'] },
       ...
     ]
     "letra" tiene que existir en contenido/letras.js (usa sounds/{letra}.mp3).
     "correctas" son las palabras que SÍ tienen ese sonido escondido;
     "incorrectas" las que no. Todas salen de contenido/palabras.js.
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['sonido-escondido'] = {

  titulo: 'Sonido escondido',
  consigna: 'Escuchá el sonido y tocá las imágenes que lo tienen escondido',
  mensajeFinal: 'Encontraste todos los sonidos escondidos.',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="10" cy="10" r="6"/><path d="m20 20-4.5-4.5"/><path d="M7.5 8.5a5 5 0 0 1 0 3"/></svg>`,

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const rondas = actividad.rondas || [];

    let indiceRonda = 0;
    let encontrados = 0;
    let ocupado = false;   // bloquea toques durante la animación de feedback
    let vivo = true;       // se apaga al salir de la pantalla

    const progreso = el('p', { class: 'progress-text' });
    const contador = el('p', { class: 'sound-hunt-count' });
    const escenario = el('div', { class: 'word-stage' });
    const botonEscuchar = el('button', {
      class: 'tap-button', 'aria-label': 'Escuchar el sonido',
      html: AS.ui.ICONO_PARLANTE_GRANDE,
      onclick: () => sonar(),
    });
    escenario.appendChild(botonEscuchar);
    const grilla = el('div', { class: 'sound-hunt-grid' });

    contenedor.append(
      progreso, escenario,
      el('p', { class: 'tap-hint' }, 'Tocá el parlante para escuchar el sonido'),
      contador, grilla,
      el('p', { class: 'help-hint' }, 'Si necesitás ayuda, tocá el parlante de la imagen y escuchá la palabra')
    );
    let vozActual = null;

    function cargarRonda(i){
      const ronda = rondas[i];
      progreso.textContent = `Ronda ${i + 1} de ${rondas.length}`;
      encontrados = 0;
      ocupado = false;
      contador.textContent = `Encontraste 0 de ${ronda.correctas.length}`;

      const tarjetas = AS.util.mezclar(
        ronda.correctas.map(id => ({ palabra: AS.palabra(id), correcta: true }))
          .concat(ronda.incorrectas.map(id => ({ palabra: AS.palabra(id), correcta: false })))
      );

      grilla.innerHTML = '';
      grilla.classList.toggle('cuatro', tarjetas.length === 4);
      tarjetas.forEach(({ palabra, correcta }) => {
        const tarjeta = el('button', {
          class: 'sound-hunt-card',
          'aria-label': `¿Tiene el sonido escondido, ${palabra.texto}?`,
        }, AS.ui.imagenPalabra(palabra.id));
        tarjeta.onclick = () => elegir(tarjeta, correcta);
        // Parlantito de la palabra (voz/{id}.mp3): no cuenta como elegir la imagen
        const parlante = el('button', {
          class: 'card-speaker',
          'aria-label': `Escuchar la palabra ${palabra.texto}`,
          html: AS.ui.ICONO_PARLANTE_CHICO,
          onclick: () => { if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(palabra.voz); },
        });
        grilla.appendChild(el('div', { class: 'sound-hunt-item' }, tarjeta, parlante));
      });
    }

    function sonar(){
      const ronda = rondas[indiceRonda];
      AS.audio.reproducir(`sounds/${ronda.letra}.mp3`);
    }

    function elegir(tarjeta, correcta){
      if (ocupado || tarjeta.disabled) return;
      const ronda = rondas[indiceRonda];
      if (correcta){
        AS.audio.acierto();
        tarjeta.classList.add('encontrada');
        tarjeta.disabled = true;
        encontrados++;
        contador.textContent = `Encontraste ${encontrados} de ${ronda.correctas.length}`;
        if (encontrados >= ronda.correctas.length){
          ocupado = true;
          escenario.classList.add('celebrate');
          setTimeout(() => {
            if (!vivo) return;
            escenario.classList.remove('celebrate');
            indiceRonda++;
            if (indiceRonda >= rondas.length) api.terminar();
            else cargarRonda(indiceRonda);
          }, 1100);
        }
      } else {
        AS.audio.error();
        tarjeta.classList.add('descartada');
        tarjeta.disabled = true;
      }
    }

    cargarRonda(0);
    return () => { vivo = false; if (vozActual) vozActual.pause(); };
  },
};
