/* ============================================================
   NÚCLEO · pantalla de revisión
   Se abre agregando  ?revisar  al final del link. Muestra, por
   actividad, qué palabras usa y si están todos los archivos
   (imágenes, ayudas, consignas, sonidos). No la ven los chicos.
   ============================================================ */
window.AS = window.AS || {};

AS.revisar = function(){
  const el = AS.util.el;
  const conServidor = /^https?:/.test(location.protocol);

  // true = existe, false = falta, null = no se puede saber
  function archivoExiste(ruta){
    if (!conServidor) return Promise.resolve(null);
    return fetch(ruta, { method: 'HEAD' }).then(r => r.ok).catch(() => false);
  }
  function imagenExiste(ruta){
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.src = ruta;
    });
  }
  function marca(valor){
    if (valor === true) return el('span', { class: 'ok' }, '✓');
    if (valor === false) return el('span', { class: 'mal' }, '✗ falta');
    return el('span', { class: 'nota' }, '—');
  }
  function celda(promesa){
    const td = el('td', {}, '…');
    promesa.then(v => { td.innerHTML = ''; td.appendChild(marca(v)); });
    return td;
  }

  const raiz = el('div', { class: 'revision' });
  raiz.appendChild(el('h1', {}, 'Revisión del contenido'));

  const errores = AS.problemas.filter(p => p.gravedad === 'error');
  const avisos = AS.problemas.filter(p => p.gravedad === 'aviso');
  const resumen = el('div', { class: 'resumen' });
  if (!AS.problemas.length) resumen.appendChild(el('p', { class: 'ok' }, '✓ La configuración no tiene errores.'));
  errores.forEach(p => resumen.appendChild(el('p', { class: 'mal' }, `✗ ${p.donde}: ${p.mensaje}`)));
  avisos.forEach(p => resumen.appendChild(el('p', {}, `⚠ ${p.donde}: ${p.mensaje}`)));
  if (!conServidor) resumen.appendChild(el('p', { class: 'nota' },
    'Abriste el archivo directo desde la carpeta: puedo comprobar las imágenes, pero no los audios (ayudas, consignas y sonidos). Para revisarlos, mirá esta pantalla desde el link publicado.'));
  raiz.appendChild(resumen);

  AS.niveles.forEach(nivel => {
    raiz.appendChild(el('h2', {}, nivel.titulo));
    nivel.actividades.forEach((actividad, i) => {
      const tipo = AS.tipos[actividad.tipo];
      raiz.appendChild(el('h3', {}, `Actividad ${i + 1} · ${actividad.titulo || (tipo && tipo.titulo) || actividad.tipo}  (id: ${actividad.id}, tipo: ${actividad.tipo})`));
      if (!tipo || actividad.proximamente){
        raiz.appendChild(el('p', { class: 'nota' }, 'Se muestra como "Ya viene".'));
        return;
      }

      const filas = [];
      const cabecera = (...cols) => el('tr', {}, cols.map(c => el('th', {}, c)));

      raiz.appendChild(el('p', { class: 'nota' },
        'La consigna se lee con la voz del navegador (no hace falta grabarla).'));

      if (['contar-sonidos', 'letra-inicial', 'completar-vocales'].includes(actividad.tipo)){
        (actividad.palabras || []).forEach(id => {
          const p = AS.palabra(id);
          filas.push(el('tr', {}, el('td', {}, p.texto), el('td', {}, p.inicial || '?'),
            el('td', {}, actividad.tipo === 'contar-sonidos' ? String(p.sonidos ?? '?') : '—'),
            celda(imagenExiste(p.imagen)),
            actividad.tipo === 'contar-sonidos' ? celda(archivoExiste(p.ayuda))
              : (actividad.tipo === 'completar-vocales' && actividad.botonSonido) ? celda(archivoExiste(p.voz)) : el('td', {}, '—')));
        });
        raiz.appendChild(el('table', {}, cabecera('Palabra', 'Inicial', 'Sonidos', 'Imagen', actividad.tipo === 'completar-vocales' ? 'Audio del parlante (voz/)' : 'Audio de ayuda'), filas));
      }

      if (actividad.tipo === 'unir-igual'){
        [['Izquierda', actividad.izquierda], ['Derecha', actividad.derecha]].forEach(([lado, lista]) => {
          (lista || []).forEach(id => {
            const p = AS.palabra(id);
            filas.push(el('tr', {}, el('td', {}, lado), el('td', {}, p.texto), el('td', {}, p.inicial || '?'),
              p.color ? el('td', {}, 'color') : celda(imagenExiste(p.imagen)),
              actividad.botonSonido ? celda(archivoExiste(p.voz)) : el('td', {}, '—')));
          });
        });
        raiz.appendChild(el('table', {}, cabecera('Lado', 'Elemento', 'Inicial', 'Imagen', 'Audio del parlante (voz/)'), filas));
      }

      if (actividad.tipo === 'sonido-letras'){
        const ids = actividad.habilitadas || actividad.letras;
        const letras = ids ? ids.map(id => AS.letras.find(l => l.id === id)).filter(Boolean) : AS.letras;
        letras.forEach(l => filas.push(el('tr', {}, el('td', {}, l.texto), celda(archivoExiste(`sounds/${l.id}.mp3`)))));
        raiz.appendChild(el('table', {}, cabecera('Letra', `Sonido (sounds/…mp3)`), filas));
      }
    });
  });

  AS.pantallas.mostrar
    ? AS.pantallas.mostrar(raiz)
    : (document.getElementById('app').appendChild(raiz));
};
