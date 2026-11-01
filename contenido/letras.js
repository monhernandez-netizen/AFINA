/* ============================================================
   LETRAS PARA LA ACTIVIDAD "sonido-letras" (teclado)
   ------------------------------------------------------------
     id     nombre del archivo de sonido: sounds/{id}.mp3
     texto  lo que se ve en la tecla y en pantalla grande
     tipo   vowel (vocal) / consonant / digraph
     tecla  tecla física del teclado que la activa (los dígrafos no tienen)
   ============================================================ */
window.AS = window.AS || {};

AS.letras = [
  { id: 'a',  texto: 'A',  tipo: 'vowel',     tecla: 'a' },
  { id: 'b',  texto: 'B',  tipo: 'consonant', tecla: 'b' },
  { id: 'c',  texto: 'C',  tipo: 'consonant', tecla: 'c' },
  { id: 'd',  texto: 'D',  tipo: 'consonant', tecla: 'd' },
  { id: 'e',  texto: 'E',  tipo: 'vowel',     tecla: 'e' },
  { id: 'f',  texto: 'F',  tipo: 'consonant', tecla: 'f' },
  { id: 'g',  texto: 'G',  tipo: 'consonant', tecla: 'g' },
  { id: 'h',  texto: 'H',  tipo: 'consonant', tecla: 'h' },
  { id: 'i',  texto: 'I',  tipo: 'vowel',     tecla: 'i' },
  { id: 'j',  texto: 'J',  tipo: 'consonant', tecla: 'j' },
  { id: 'k',  texto: 'K',  tipo: 'consonant', tecla: 'k' },
  { id: 'l',  texto: 'L',  tipo: 'consonant', tecla: 'l' },
  { id: 'm',  texto: 'M',  tipo: 'consonant', tecla: 'm' },
  { id: 'n',  texto: 'N',  tipo: 'consonant', tecla: 'n' },
  { id: 'nn', texto: 'Ñ',  tipo: 'consonant', tecla: 'ñ' },
  { id: 'o',  texto: 'O',  tipo: 'vowel',     tecla: 'o' },
  { id: 'p',  texto: 'P',  tipo: 'consonant', tecla: 'p' },
  { id: 'q',  texto: 'Q',  tipo: 'consonant', tecla: 'q' },
  { id: 'r',  texto: 'R',  tipo: 'consonant', tecla: 'r' },
  { id: 's',  texto: 'S',  tipo: 'consonant', tecla: 's' },
  { id: 't',  texto: 'T',  tipo: 'consonant', tecla: 't' },
  { id: 'u',  texto: 'U',  tipo: 'vowel',     tecla: 'u' },
  { id: 'v',  texto: 'V',  tipo: 'consonant', tecla: 'v' },
  { id: 'w',  texto: 'W',  tipo: 'consonant', tecla: 'w' },
  { id: 'x',  texto: 'X',  tipo: 'consonant', tecla: 'x' },
  { id: 'y',  texto: 'Y',  tipo: 'consonant', tecla: 'y' },
  { id: 'z',  texto: 'Z',  tipo: 'consonant', tecla: 'z' },
  { id: 'ch', texto: 'CH', tipo: 'digraph' },
  { id: 'll', texto: 'LL', tipo: 'digraph' },
  { id: 'rr', texto: 'RR', tipo: 'digraph' },
];

/* ============================================================
   GRUPOS DE LETRAS (para el teclado de ayuda de cada nivel)
   ------------------------------------------------------------
     vocal        a e i o u
     prolongable  consonantes que se pueden "estirar": f j l ll m n ñ r rr s v y z
     explosiva    consonantes que suenan de golpe: b c ch d g k p q t
     otra         h (muda), w, x
   Cada nivel decide qué grupos suenan en su teclado: ver "teclado" en
   contenido/niveles.js. Las demás teclas se ven apagadas.
   ============================================================ */
AS.gruposLetras = {
  vocal:       ['a', 'e', 'i', 'o', 'u'],
  prolongable: ['f', 'j', 'l', 'll', 'm', 'n', 'nn', 'r', 'rr', 's', 'v', 'y', 'z'],
  explosiva:   ['b', 'c', 'ch', 'd', 'g', 'k', 'p', 'q', 't'],
  otra:        ['h', 'w', 'x'],
};
AS.grupoDeLetra = function(id){
  return Object.keys(AS.gruposLetras).find(g => AS.gruposLetras[g].includes(id)) || 'otra';
};
