/* ============================================================
   NÚCLEO · chequeo de la configuración
   Revisa contenido/niveles.js y contenido/palabras.js buscando
   errores de tipeo o datos que falten. Los problemas se muestran
   en la consola del navegador y en la pantalla de revisión
   (agregando ?revisar al final del link).
   ============================================================ */
window.AS = window.AS || {};

AS.validar = function(){
  const problemas = [];
  const error = (donde, mensaje) => problemas.push({ gravedad: 'error', donde, mensaje });
  const aviso = (donde, mensaje) => problemas.push({ gravedad: 'aviso', donde, mensaje });

  const idsVistos = new Set();

  AS.niveles.forEach(nivel => {
    nivel.actividades.forEach((actividad, i) => {
      const donde = `${nivel.titulo} · Actividad ${i + 1} (${actividad.id})`;

      if (!actividad.id) error(donde, 'Le falta el "id".');
      else if (idsVistos.has(actividad.id)) error(donde, `El id "${actividad.id}" está repetido: cada actividad necesita uno propio.`);
      idsVistos.add(actividad.id);

      const tipo = AS.tipos[actividad.tipo];
      if (!tipo){ error(donde, `El tipo "${actividad.tipo}" no existe.`); return; }
      if (actividad.proximamente) return;

      const existe = id => {
        if (!AS.palabras[id]){ error(donde, `La palabra "${id}" no está en contenido/palabras.js.`); return false; }
        return true;
      };

      if (actividad.tipo === 'contar-sonidos'){
        (actividad.palabras || []).forEach(id => {
          if (existe(id) && !AS.palabras[id].sonidos) error(donde, `A la palabra "${id}" le falta el dato "sonidos".`);
        });
        if (!(actividad.palabras || []).length) error(donde, 'No tiene palabras.');
      }

      if (actividad.tipo === 'letra-inicial'){
        (actividad.palabras || []).forEach(id => {
          if (existe(id) && !AS.palabras[id].inicial) error(donde, `A la palabra "${id}" le falta el dato "inicial".`);
        });
        if (!(actividad.palabras || []).length) error(donde, 'No tiene palabras.');
      }

      if (actividad.tipo === 'completar-vocales'){
        (actividad.palabras || []).forEach(id => {
          if (existe(id) && !/[aeiouáéíóú]/i.test(AS.palabras[id].texto || id)) error(donde, `La palabra "${id}" no tiene vocales para completar.`);
        });
        if (!(actividad.palabras || []).length) error(donde, 'No tiene palabras.');
      }

      if (actividad.tipo === 'unir-igual'){
        const izq = (actividad.izquierda || []).filter(existe);
        // La derecha puede ser: imágenes (derecha), letras (derechaLetras) o palabras escritas (derechaPalabras)
        const cuentaClave = (lista, clave) => lista.reduce((m, id) => { const l = clave(id); m[l] = (m[l] || 0) + 1; return m; }, {});
        let der, ci, cd;
        if (actividad.derechaLetras){
          const letrasDer = actividad.derechaLetras.map(x => (typeof x === 'string' ? x : x.letra).toUpperCase());
          der = letrasDer;
          ci = cuentaClave(izq, id => (AS.palabras[id].inicial || '').toUpperCase());
          cd = cuentaClave(letrasDer, l => l);
        } else if (actividad.derechaPalabras){
          der = actividad.derechaPalabras.filter(existe);
          ci = cuentaClave(izq, id => (AS.palabras[id].texto || id).toUpperCase());
          cd = cuentaClave(der, id => (AS.palabras[id].texto || id).toUpperCase());
        } else {
          der = (actividad.derecha || []).filter(existe);
          ci = cuentaClave(izq, id => AS.palabras[id].inicial);
          cd = cuentaClave(der, id => AS.palabras[id].inicial);
        }
        if (izq.length !== der.length) error(donde, `Hay ${izq.length} tarjetas a la izquierda y ${der.length} a la derecha: tienen que ser la misma cantidad.`);
        const letras = new Set([...Object.keys(ci), ...Object.keys(cd)]);
        letras.forEach(l => {
          if ((ci[l] || 0) !== (cd[l] || 0)) error(donde, `La letra ${l} aparece ${ci[l] || 0} vez/veces a la izquierda y ${cd[l] || 0} a la derecha: no se podría completar.`);
        });
      }

      if (actividad.tipo === 'sonido-letras' && (actividad.letras || actividad.habilitadas)){
        (actividad.letras || []).concat(actividad.habilitadas || []).forEach(id => {
          if (!AS.letras.find(l => l.id === id)) error(donde, `La letra "${id}" no existe en contenido/letras.js.`);
        });
      }
    });

    if (nivel.actividades.length > AS.config.actividadesPorNivel){
      aviso(nivel.titulo, `Tiene ${nivel.actividades.length} actividades pero el menú muestra ${AS.config.actividadesPorNivel} casilleros (contenido/config.js).`);
    }
  });

  problemas.forEach(p => (p.gravedad === 'error' ? console.error : console.warn)(`[Conciencia Fonológica] ${p.donde}: ${p.mensaje}`));
  AS.problemas = problemas;
  return problemas;
};
