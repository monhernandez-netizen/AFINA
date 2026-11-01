/* ============================================================
   TIPO DE ACTIVIDAD · "letra-inicial"
   Se ve un dibujo y el chico toca con qué letra comienza.

   Configuración que lee de niveles.js:
     palabras: ['diablo', 'bruja', ...]  (cada una necesita "inicial"
                                          en contenido/palabras.js)
     opciones: 6                          (cuántas letras se ofrecen; opcional)
   ============================================================ */
window.AS = window.AS || {};
AS.tipos = AS.tipos || {};

AS.tipos['letra-inicial'] = {

  titulo: '¿Con qué letra comienza?',
  consigna: 'Mirá el dibujo y tocá la letra correcta',
  mensajeFinal: 'Encontraste la primera letra de todas las palabras.',
  icono: `<svg viewBox="0 0 24 24"><text x="12" y="17" font-family="Andika, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">Aa</text></svg>`,

  ABECEDARIO: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'],

  // Devuelve la letra correcta mezclada con letras distractoras.
  // Si la inicial es un dígrafo (CH, LL, RR) también se ofrece su
  // primera letra suelta (C, L, R), que es la confusión típica.
  armarOpciones(correcta, cantidad){
    const abc = AS.tipos['letra-inicial'].ABECEDARIO;
    const obligatorias = [];
    if (correcta.length > 1) obligatorias.push(correcta[0]);
    const resto = AS.util.mezclar(abc.filter(l => l !== correcta && !obligatorias.includes(l)));
    const distractoras = obligatorias.concat(resto).slice(0, cantidad - 1);
    return AS.util.mezclar([correcta, ...distractoras]);
  },

  montar(contenedor, actividad, api){
    const el = AS.util.el;
    const palabras = actividad.palabras.map(AS.palabra);
    const cantidadOpciones = actividad.opciones || 6;

    const conSonido = actividad.botonSonido !== false;   // por defecto, cada imagen tiene su parlante
    let indice = 0;
    let ocupado = false;
    let vivo = true;
    let vozActual = null;

    const progreso = el('p', { class: 'progress-text' });
    const escenario = el('div', { class: 'word-stage' });
    const opciones = el('div', { class: 'letter-options' });
    contenedor.append(progreso, escenario, opciones);
    if (conSonido) contenedor.append(el('p', { class: 'help-hint' }, 'Si necesitás ayuda, escuchá la palabra'));

    function cargarPalabra(i){
      const palabra = palabras[i];
      progreso.textContent = `Imagen ${i + 1} de ${palabras.length}`;
      ocupado = false;
      escenario.innerHTML = '';
      escenario.appendChild(AS.ui.imagenPalabra(palabra.id));
      if (conSonido){
        escenario.appendChild(el('button', {
          class: 'card-speaker',
          'aria-label': 'Escuchar la palabra',
          html: AS.ui.ICONO_PARLANTE_CHICO,
          onclick: () => { if (vozActual) vozActual.pause(); vozActual = AS.audio.reproducir(palabra.voz); },
        }));
      }

      opciones.innerHTML = '';
      AS.tipos['letra-inicial'].armarOpciones(palabra.inicial, cantidadOpciones).forEach(letra => {
        const boton = el('button', { class: 'letter-option', onclick: () => elegir(letra, boton) }, letra);
        opciones.appendChild(boton);
      });
    }

    function elegir(letra, boton){
      if (ocupado) return;
      if (letra === palabras[indice].inicial){
        ocupado = true;
        AS.audio.acierto();
        boton.classList.add('correct');
        Array.from(opciones.children).forEach(b => b.disabled = true);
        setTimeout(() => {
          if (!vivo) return;
          indice++;
          if (indice >= palabras.length) api.terminar();
          else cargarPalabra(indice);
        }, 1100);
      } else {
        AS.audio.error();
        boton.classList.add('wrong');
        boton.disabled = true;
        setTimeout(() => boton.classList.remove('wrong'), 500);
      }
    }

    cargarPalabra(0);
    return () => { vivo = false; if (vozActual) vozActual.pause(); };
  },
};
