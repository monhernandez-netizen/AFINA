/* ============================================================
   NÚCLEO · utilidades chiquitas que usan todos los módulos
   ============================================================ */
window.AS = window.AS || {};

AS.util = {

  // Mezcla una lista (devuelve una copia, no toca la original)
  mezclar(lista){
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  },

  // Crea un elemento HTML:  AS.util.el('div', { class:'x', onclick: fn }, 'texto', otroElemento)
  el(etiqueta, atributos, ...hijos){
    const nodo = document.createElement(etiqueta);
    Object.entries(atributos || {}).forEach(([clave, valor]) => {
      if (valor === undefined || valor === null || valor === false) return;
      if (clave === 'class') nodo.className = valor;
      else if (clave === 'html') nodo.innerHTML = valor;
      else if (clave === 'style' && typeof valor === 'object'){
        Object.entries(valor).forEach(([prop, val]) => {
          if (prop.startsWith('--')) nodo.style.setProperty(prop, val);
          else nodo.style[prop] = val;
        });
      }
      else if (clave.startsWith('on') && typeof valor === 'function') nodo.addEventListener(clave.slice(2), valor);
      else nodo.setAttribute(clave, valor === true ? '' : valor);
    });
    hijos.flat().forEach(hijo => {
      if (hijo === undefined || hijo === null || hijo === false) return;
      nodo.appendChild(typeof hijo === 'string' ? document.createTextNode(hijo) : hijo);
    });
    return nodo;
  },
};
