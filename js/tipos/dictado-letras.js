/* ============================================================
   TIPO DE ACTIVIDAD · "dictado-letras"
   Un parlante grande hace sonar el sonido de una letra SIN mostrar
   ninguna pista visual (ni dibujo ni la letra escrita) y el chico
   tiene que tocar cuál es, entre las opciones. El sonido no arranca
   solo al entrar: hay que tocar el parlante (así da tiempo a
   escuchar primero la consigna, y se puede volver a escuchar las
   veces que haga falta). Usa los mismos audios que el teclado
   (sounds/{id}.mp3), no hace falta grabar nada nuevo.

   Configuración que lee de niveles.js:
     letras: ['a', 'e', 'i', 'o', 'u']   letras que se dictan y, a la vez,
                                          las opciones que se muestran para
                                          elegir. Si no se pone, usa las
                                          5 vocales.
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['dictado-letras'] = {

  titulo: 'Dictado de letras',
  consigna: 'Escuchá el sonido y tocá la letra que corresponde',
  mensajeFinal: 'Completaste el dictado.',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 15V9a2 2 0 0 1 2-2h2l5-4v18l-5-4H6a2 2 0 0 1-2-2Z"/><path d="M17.5 8.5a5 5 0 0 1 0 7"/>
    <path d="M12 21v-2M8 21v-1M16 21v-1" stroke-linecap="round"/></svg>`,

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const idsPool = actividad.letras || ['a', 'e', 'i', 'o', 'u'];
    const opcionesLetras = idsPool.map(id => AS.letras.find(l => l.id === id)).filter(Boolean);
    const rondas = AS.util.mezclar(opcionesLetras.slice());

    let indice = 0;
    let ocupado = false;   // bloquea toques durante la animación de feedback
    let vivo = true;       // se apaga al salir de la pantalla

    const progreso = el('p', { class: 'progress-text' });
    const escenario = el('div', { class: 'word-stage' });
    const botonEscuchar = el('button', {
      class: 'tap-button', 'aria-label': 'Escuchar el sonido',
      html: AS.ui.ICONO_PARLANTE_GRANDE,
      onclick: () => sonar(),
    });
    escenario.appendChild(botonEscuchar);
    const opciones = el('div', { class: 'vowel-options' });

    contenedor.append(
      progreso, escenario, opciones,
      el('p', { class: 'tap-hint' }, 'Tocá el parlante para escuchar el sonido')
    );

    function cargarRonda(i){
      progreso.textContent = `Sonido ${i + 1} de ${rondas.length}`;
      ocupado = false;
      escenario.classList.remove('celebrate');
      opciones.innerHTML = '';
      opcionesLetras.forEach(letra => {
        const boton = el('button', {
          class: 'letter-option', 'aria-label': `¿Es la letra ${letra.texto}?`,
        }, letra.texto);
        boton.onclick = () => elegir(letra, boton);
        opciones.appendChild(boton);
      });
      // No suena solo: como en el resto de la app, el sonido arranca recién
      // cuando tocan el parlante (así da tiempo a escuchar la consigna antes).
    }

    function sonar(){
      const letra = rondas[indice];
      AS.audio.reproducir(`sounds/${letra.id}.mp3`);
    }

    function elegir(letraElegida, boton){
      if (ocupado) return;
      const correcta = rondas[indice];
      if (letraElegida.id === correcta.id){
        ocupado = true;
        AS.audio.acierto();
        boton.classList.add('correct');
        Array.from(opciones.children).forEach(b => b.disabled = true);
        escenario.classList.add('celebrate');
        setTimeout(() => {
          if (!vivo) return;
          indice++;
          if (indice >= rondas.length) api.terminar();
          else cargarRonda(indice);
        }, 1100);
      } else {
        AS.audio.error();
        boton.classList.add('wrong');
        boton.disabled = true;
        setTimeout(() => boton.classList.remove('wrong'), 500);
      }
    }

    cargarRonda(0);
    return () => { vivo = false; };
  },
};
