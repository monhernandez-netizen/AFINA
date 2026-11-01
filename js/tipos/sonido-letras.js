/* ============================================================
   TIPO DE ACTIVIDAD · "sonido-letras"
   Teclado en pantalla: al tocar una letra aparece grande y suena
   su fonema (sounds/{id}.mp3). También responde al teclado real.

   Configuración que lee de niveles.js:
     letras: ['a','e','i','o','u']       (opcional) muestra SOLO esas teclas.
     habilitadas: ['a','e','i','o','u']  (opcional) muestra el tablero completo
                                          pero solo esas teclas tienen letra y
                                          sonido; las demás quedan vacías.
     Si no se pone ninguna, se ven todas las letras de contenido/letras.js.
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['sonido-letras'] = {

  titulo: 'El sonido de las letras',
  consigna: 'Tocá una letra y escuchá su sonido',
  mensajeFinal: '',
  icono: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 15V9a2 2 0 0 1 2-2h2l5-4v18l-5-4H6a2 2 0 0 1-2-2Z"/><path d="M17.5 8.5a5 5 0 0 1 0 7"/><path d="M20.2 6a9 9 0 0 1 0 12"/></svg>`,

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const habilitadasIds = actividad.habilitadas || null;
    const teclasVisibles = actividad.letras
      ? actividad.letras.map(id => AS.letras.find(l => l.id === id)).filter(Boolean)
      : AS.letras;
    // Con "habilitadas", solo esas suenan; el resto del tablero queda vacío
    const letras = habilitadasIds ? teclasVisibles.filter(l => habilitadasIds.includes(l.id)) : teclasVisibles;

    const ondita = el('div', { class: 'ripple' });
    const letraGrande = el('div', { class: 'letter placeholder' }, 'Tocá una letra para empezar');
    const escenario = el('div', { class: 'stage' }, ondita, letraGrande);
    const teclado = el('div', { class: 'keyboard' });
    contenedor.append(
      escenario, teclado,
      el('footer', {}, 'Funciona con el teclado de la computadora o tocando las letras en pantalla.')
    );

    // Un audio por letra, ya listo para sonar al instante
    const audios = {};
    const botones = {};
    teclasVisibles.forEach(letra => {
      if (habilitadasIds && !habilitadasIds.includes(letra.id)){
        // Tecla vacía: ocupa su lugar en el tablero pero no hace nada
        teclado.appendChild(el('span', { class: 'key is-empty', 'aria-hidden': 'true' }));
        return;
      }
      audios[letra.id] = AS.audio.precargar(`sounds/${letra.id}.mp3`);
      const boton = el('button', {
        class: `key is-${letra.tipo}`,
        'aria-label': `Sonido de la letra ${letra.texto}`,
        onclick: () => activar(letra),
      }, letra.texto);
      botones[letra.id] = boton;
      teclado.appendChild(boton);
    });

    function activar(letra){
      letraGrande.textContent = letra.texto;
      letraGrande.classList.remove('placeholder');

      escenario.classList.remove('is-vowel', 'is-consonant');
      escenario.classList.add(letra.tipo === 'vowel' ? 'is-vowel' : 'is-consonant');

      ondita.classList.remove('animate');
      void ondita.offsetWidth; // reinicia la animación
      ondita.classList.add('animate');

      const boton = botones[letra.id];
      boton.classList.add('pressed');
      setTimeout(() => boton.classList.remove('pressed'), 120);

      const audio = audios[letra.id];
      audio.currentTime = 0;
      audio.play().catch(AS.audio.avisoSinSonido);
    }

    function alTeclear(evento){
      if (evento.repeat || evento.ctrlKey || evento.metaKey || evento.altKey) return;
      const letra = letras.find(l => l.tecla === evento.key.toLowerCase());
      if (letra) activar(letra);
    }
    window.addEventListener('keydown', alTeclear);

    // Al salir de la pantalla se deja de escuchar el teclado
    return () => window.removeEventListener('keydown', alTeclear);
  },
};
