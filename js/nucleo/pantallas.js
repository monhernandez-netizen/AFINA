/* ============================================================
   NÚCLEO · navegación entre pantallas
   Pantallas: inicio → menú de un nivel → actividad → pantalla final.
   Todo se arma a partir de contenido/niveles.js, así que mover una
   actividad de lugar se hace allá, sin tocar este archivo.
   ============================================================ */
window.AS = window.AS || {};

AS.pantallas = (function(){
  const el = AS.util.el;
  let alSalir = null; // función de limpieza de la pantalla actual

  function mostrar(pantalla, limpieza){
    document.body.classList.remove('con-ayuda-teclado');
    if (alSalir){ alSalir(); alSalir = null; }
    alSalir = limpieza || null;
    const raiz = document.getElementById('app');
    raiz.innerHTML = '';
    pantalla.classList.add('screen', 'active');
    raiz.appendChild(pantalla);
    window.scrollTo(0, 0);
  }

  const COLORES = { verde: 'unahur-green', azul: 'unahur-blue' };

  // Tarjeta que se puede tocar con el dedo o con el teclado (Enter / espacio).
  // Es un <div> porque adentro lleva el botoncito del parlante.
  function tarjeta(atributos, alAbrir, ...hijos){
    return el('div', Object.assign({
      class: 'level-card', role: 'button', tabindex: '0',
      onclick: alAbrir,
      onkeydown: e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); alAbrir(); } },
    }, atributos), ...hijos);
  }

  const TEXTO_INICIO = 'Tocá la tarjeta con el dedo o con el mouse para elegir el nivel en el que vas a practicar';
  const TEXTO_MENU = 'Tocá la tarjeta con el dedo o con el mouse para elegir la actividad que vas a practicar';
  const NUMEROS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis'];

  // ---------- Inicio ----------
  function inicio(){
    const tarjetas = AS.niveles.map(nivel => {
      const numero = String(nivel.numero || nivel.titulo.replace(/\D+/g, ''));
      return tarjeta({ 'data-color': COLORES[nivel.color] || 'unahur-blue', 'aria-label': nivel.titulo },
        () => menu(nivel.id),
        AS.ui.parlanteTarjeta(`consignas/${nivel.id}.mp3`, `Nivel ${NUMEROS[numero] || numero}`, `Escuchar: ${nivel.titulo}`),
        el('span', { class: 'level-number-badge' }, numero),
        el('p', { class: 'level-title' }, nivel.titulo)
      );
    });

    mostrar(el('div', {},
      el('div', { class: 'home-hero' },
        el('span', { class: 'brand-mark', 'aria-hidden': 'true' }, el('span'), el('span'), el('span'), el('span')),
        el('h1', {}, el('span', { class: 'tone-a' }, AS.config.tituloParte1), ' ', el('span', { class: 'tone-b' }, AS.config.tituloParte2)),
        AS.ui.indicacion(TEXTO_INICIO, 'consignas/inicio.mp3')
      ),
      el('div', { class: 'levels-grid' }, tarjetas),
      el('p', { class: 'credit-line' }, AS.config.credito)
    ));
  }

  // ---------- Menú de actividades de un nivel ----------
  function menu(idNivel){
    const nivel = AS.nivel(idNivel);
    const color = COLORES[nivel.color] || 'unahur-blue';

    const tarjetas = nivel.actividades.map((actividad, i) => {
      const tipo = AS.tipos[actividad.tipo];
      if (!tipo || actividad.proximamente) return tarjetaBloqueada(i + 1);
      const consigna = actividad.consignaVoz || actividad.consigna || tipo.consigna || '';
      return tarjeta({ 'data-color': color },
        () => jugar(idNivel, actividad.id),
        AS.ui.parlanteTarjeta(`consignas/${actividad.id}.mp3`, consigna, `Escuchar: actividad ${i + 1}`),
        AS.ui.iconoActividad(actividad, tipo),
        el('p', { class: 'level-title' }, `Actividad ${i + 1}`),
        el('p', { class: 'level-desc' }, actividad.titulo || tipo.titulo)
      );
    });
    // Completa con "Ya viene" hasta llegar a la cantidad de casilleros del menú
    for (let i = nivel.actividades.length; i < AS.config.actividadesPorNivel; i++){
      tarjetas.push(tarjetaBloqueada(i + 1));
    }

    mostrar(el('div', {},
      AS.ui.botonVolver('Volver al inicio', inicio, { icono: 'casa', audio: 'consignas/volver-inicio.mp3' }),
      el('header', {}, el('h1', {}, nivel.titulo), AS.ui.indicacion(TEXTO_MENU, 'consignas/menu.mp3')),
      el('div', { class: 'levels-grid' }, tarjetas)
    ));
  }

  function tarjetaBloqueada(numero){
    return el('div', { class: 'level-card locked' },
      el('span', { class: 'ribbon' }, 'Ya viene'),
      el('span', { class: 'level-icon' }),
      el('p', { class: 'level-title' }, `Actividad ${numero}`),
      el('p', { class: 'level-desc' }, 'Próximamente')
    );
  }

  // ---------- Una actividad ----------
  function jugar(idNivel, idActividad){
    const nivel = AS.nivel(idNivel);
    const actividad = AS.actividad(idNivel, idActividad);
    const tipo = AS.tipos[actividad.tipo];

    const pantalla = el('div', { style: { '--level-accent': nivel.acento || '#05A3C8' } });
    pantalla.appendChild(AS.ui.botonVolver('Elegir otra actividad', () => menu(idNivel), { icono: 'flecha', audio: 'consignas/elegir-otra-actividad.mp3' }));
    pantalla.appendChild(AS.ui.encabezado(nivel, actividad, tipo));

    const zona = el('div', { style: { display: 'contents' } });
    pantalla.appendChild(zona);

    // Cada tipo de actividad recibe: dónde dibujarse, su configuración,
    // y unas pocas funciones para avisar que terminó.
    const api = {
      nivel,
      terminar: () => fin(idNivel, idActividad),
    };
    const limpieza = tipo.montar(zona, actividad, api);
    mostrar(pantalla, limpieza);
  }

  // ---------- Pantalla final ----------
  function fin(idNivel, idActividad){
    const actividad = AS.actividad(idNivel, idActividad);
    const tipo = AS.tipos[actividad.tipo];
    const mensaje = actividad.mensajeFinal || tipo.mensajeFinal || 'Terminaste esta actividad.';
    mostrar(el('div', {},
      el('div', { class: 'level-complete' },
        el('div', { class: 'icon' }, '🎉'),
        el('div', { class: 'instruction-row' },
          el('h2', {}, '¡Muy bien! ¡Completaste esta actividad!'),
          el('button', { class: 'instruction-speaker', 'aria-label': 'Escuchar', html: AS.ui.ICONO_PARLANTE_CHICO,
            onclick: () => AS.audio.leerConsigna('consignas/final.mp3', '¡Muy bien! Completaste esta actividad') })),
        el('p', {}, mensaje),
        AS.ui.botonVolver('Volver a las actividades', () => menu(idNivel), { icono: 'flecha', audio: 'consignas/volver-actividades.mp3', grande: true })
      )
    ));
    // ¡A festejar! Fanfarria + aplausos + confeti
    AS.audio.fanfarria();
  }

  return { inicio, menu, jugar, fin, mostrar };
})();
