/* ============================================================
   NÚCLEO · acceso al catálogo de palabras
   Devuelve una palabra con todos sus datos completos, aplicando
   las rutas por defecto (images/{id}.png, ayuda/{id}.mp3).
   ============================================================ */
window.AS = window.AS || {};

AS.palabra = function(id){
  const base = (AS.palabras || {})[id];
  if (!base){
    console.warn(`[Conciencia Fonológica] La palabra "${id}" no está en contenido/palabras.js`);
    return { id, texto: id, imagen: `images/${id}.png`, ayuda: `ayuda/${id}.mp3`, voz: `voz/${id}.mp3`, inicial: '?', faltaEnCatalogo: true };
  }
  return Object.assign({
    id,
    texto: id,
    imagen: `images/${id}.png`,
    ayuda: `ayuda/${id}.mp3`,
    voz: `voz/${id}.mp3`,
  }, base);
};

AS.nivel = function(idNivel){
  return AS.niveles.find(n => n.id === idNivel);
};

AS.actividad = function(idNivel, idActividad){
  const nivel = AS.nivel(idNivel);
  return nivel ? nivel.actividades.find(a => a.id === idActividad) : undefined;
};
