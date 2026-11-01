/* ============================================================
   CATÁLOGO DE PALABRAS
   ------------------------------------------------------------
   Cada palabra se define UNA sola vez acá, y después se usa en
   las actividades (contenido/niveles.js) nombrándola por su id.

   Campos:
     texto    cómo se escribe (se ve si todavía no está la imagen)
     inicial  con qué letra comienza (o CH / LL / RR)
     sonidos  cuántos sonidos tiene (solo hace falta si la palabra
              se usa en una actividad de "contar-sonidos")
     color    solo para los colores: en vez de imagen se muestra
              un cuadro de ese color

   Archivos que busca la app, con el mismo id:
     images/{id}.png     el dibujo
     ayuda/{id}.mp3      la palabra dicha separada (botón de ayuda)
     voz/{id}.mp3        la palabra dicha desde el parlantito de la tarjeta
                         (actividades de unir con botonSonido)

   Para agregar una palabra: copiá una línea, cambiá el id y los
   datos, y poné la imagen images/{id}.png (sin tildes ni espacios).

   IMPORTANTE — sobre "sonidos":
   Las 15 palabras que ya estaban en la app (pato, mesa, sapo, luna,
   gato, camisa, paloma, pelota, tomate, banana, plato, globo,
   choclo, sol, tren) mantienen la cantidad original. En las demás
   la cantidad fue calculada de forma automática (ej. "qu" = 1
   sonido, "ll" = 1, "c" suave = 1): REVISALA antes de usarlas en
   una actividad de contar sonidos. La pantalla de revisión
   (agregando ?revisar al link) las lista todas.
   ============================================================ */
window.AS = window.AS || {};

AS.palabras = {

  // ---- Sonido inicial: vocales (imágenes para arrastrar y unir) ----
  // La imagen de "arana" es la nueva y también la usa el Nivel 3.
  elefante: { texto: 'elefante', inicial: 'E', sonidos: 8 },
  estufa:   { texto: 'estufa',   inicial: 'E', sonidos: 6 },
  oso:      { texto: 'oso',      inicial: 'O', sonidos: 3 },
  olla:     { texto: 'olla',     inicial: 'O', sonidos: 3 },   // "ll" = 1 sonido
  uva:      { texto: 'uva',      inicial: 'U', sonidos: 3 },
  una:      { texto: 'uña',      inicial: 'U', sonidos: 3 },   // "ñ" = 1 sonido
  iman:     { texto: 'imán',     inicial: 'I', sonidos: 4 },
  iguana:   { texto: 'iguana',   inicial: 'I', sonidos: 6 },
  anillo:   { texto: 'anillo',   inicial: 'A', sonidos: 5 },   // "ll" = 1 sonido
  // (araña: ver más abajo, en "Terror")

  // ---- Nivel 1, Actividad 1: versión con fotos reales ----
  // (usan los mismos audios voz/{palabra}.mp3 que los dibujos)
  elefante_foto: { texto: 'elefante', inicial: 'E', sonidos: 8, voz: 'voz/elefante.mp3' },
  estufa_foto:   { texto: 'estufa',   inicial: 'E', sonidos: 6, voz: 'voz/estufa.mp3' },
  oso_foto:      { texto: 'oso',      inicial: 'O', sonidos: 3, voz: 'voz/oso.mp3' },
  olla_foto:     { texto: 'olla',     inicial: 'O', sonidos: 3, voz: 'voz/olla.mp3' },
  uva_foto:      { texto: 'uva',      inicial: 'U', sonidos: 3, voz: 'voz/uva.mp3' },
  una_foto:      { texto: 'uña',      inicial: 'U', sonidos: 3, voz: 'voz/una.mp3' },
  iman_foto:     { texto: 'imán',     inicial: 'I', sonidos: 4, voz: 'voz/iman.mp3' },
  anillo_foto:   { texto: 'anillo',   inicial: 'A', sonidos: 5, voz: 'voz/anillo.mp3' },
  arana_foto:    { texto: 'araña',    inicial: 'A', sonidos: 5, voz: 'voz/arana.mp3' },

  // ---- Nivel 2, Actividad 1: versión con fotos reales ----
  // (usan los mismos audios ayuda/{palabra}.mp3 y voz/{palabra}.mp3)
  luna_foto:   { texto: 'luna',   inicial: 'L', sonidos: 4, llenar: true, ayuda: 'ayuda/luna.mp3',   voz: 'voz/luna.mp3' },
  banana_foto: { texto: 'banana', inicial: 'B', sonidos: 6, ayuda: 'ayuda/banana.mp3', voz: 'voz/banana.mp3' },
  abeja_foto:  { texto: 'abeja',  inicial: 'A', sonidos: 5, ayuda: 'ayuda/abeja.mp3',  voz: 'voz/abeja.mp3' },
  momia_foto:  { texto: 'momia',  inicial: 'M', sonidos: 5, ayuda: 'ayuda/momia.mp3',  voz: 'voz/momia.mp3' },
  mono_foto:   { texto: 'mono',   inicial: 'M', sonidos: 4, ayuda: 'ayuda/mono.mp3',   voz: 'voz/mono.mp3' },

  // ---- Nivel 2: Sonido inicial (fotos reales) ----
  sol_foto:      { texto: 'sol',      inicial: 'S', sonidos: 3 },
  leon_foto:     { texto: 'león',     inicial: 'L', sonidos: 4, voz: 'voz/leon.mp3' },
  mariposa_foto: { texto: 'mariposa', inicial: 'M', sonidos: 8, voz: 'voz/mariposa.mp3' },
  foca_foto:     { texto: 'foca',     inicial: 'F', sonidos: 4 },

  // ---- Nivel 2: Sonido final (dibujos en el mismo estilo que los vehículos) ----
  regla:    { texto: 'regla',    inicial: 'R', sonidos: 5 },
  tambor:   { texto: 'tambor',   inicial: 'T', sonidos: 6 },
  guitarra: { texto: 'guitarra', inicial: 'G', sonidos: 7 },
  flauta:   { texto: 'flauta',   inicial: 'F', sonidos: 6 },
  piano:    { texto: 'piano',    inicial: 'P', sonidos: 5 },

  // ---- Palabras de las actividades de contar sonidos (originales) ----
  pato:    { texto: 'pato',    inicial: 'P',  sonidos: 4 },
  mesa:    { texto: 'mesa',    inicial: 'M',  sonidos: 4 },
  sapo:    { texto: 'sapo',    inicial: 'S',  sonidos: 4 },
  luna:    { texto: 'luna',    inicial: 'L',  sonidos: 4 },
  gato:    { texto: 'gato',    inicial: 'G',  sonidos: 4 },

  camisa:  { texto: 'camisa',  inicial: 'C',  sonidos: 6 },
  paloma:  { texto: 'paloma',  inicial: 'P',  sonidos: 6 },
  pelota:  { texto: 'pelota',  inicial: 'P',  sonidos: 6 },
  tomate:  { texto: 'tomate',  inicial: 'T',  sonidos: 6 },
  banana:  { texto: 'banana',  inicial: 'B',  sonidos: 6 },

  plato:   { texto: 'plato',   inicial: 'P',  sonidos: 5, ayuda: 'ayuda/plato.mp3', voz: 'voz/plato.mp3' },
  globo:   { texto: 'globo',   inicial: 'G',  sonidos: 5, ayuda: 'ayuda/globo.mp3', voz: 'voz/globo.mp3' },
  choclo:  { texto: 'choclo',  inicial: 'CH', sonidos: 5 },   // "ch" = 1 solo sonido
  sol:     { texto: 'sol',     inicial: 'S',  sonidos: 3 },
  tren:    { texto: 'tren',    inicial: 'T',  sonidos: 4 },

  // ---- Terror ----
  diablo:     { texto: 'diablo',     inicial: 'D', sonidos: 6 },
  vampiro:    { texto: 'vampiro',    inicial: 'V', sonidos: 7 },
  bruja:      { texto: 'bruja',      inicial: 'B', sonidos: 5 },
  fantasma:   { texto: 'fantasma',   inicial: 'F', sonidos: 8 },
  payaso:     { texto: 'payaso',     inicial: 'P', sonidos: 6 },
  vivora:     { texto: 'víbora',     inicial: 'V', sonidos: 6 },
  momia:      { texto: 'momia',      inicial: 'M', sonidos: 5 },
  esqueleto:  { texto: 'esqueleto',  inicial: 'E', sonidos: 8 },
  arana:      { texto: 'araña',      inicial: 'A', sonidos: 5 },
  murcielago: { texto: 'murciélago', inicial: 'M', sonidos: 10 },

  // ---- Útiles escolares ----
  cuaderno_rojo: { texto: 'cuaderno rojo', inicial: 'C', sonidos: 12 },
  cuaderno:      { texto: 'cuaderno',      inicial: 'C', sonidos: 8 },
  compas:        { texto: 'compás',        inicial: 'C', sonidos: 6 },
  crayones:      { texto: 'crayones',      inicial: 'C', sonidos: 8 },
  transportador: { texto: 'transportador', inicial: 'T', sonidos: 13 },
  tijera:        { texto: 'tijera',        inicial: 'T', sonidos: 6 },
  plasticola:    { texto: 'plasticola',    inicial: 'P', sonidos: 10 },
  pincel:        { texto: 'pincel',        inicial: 'P', sonidos: 6 },
  lapicera:      { texto: 'lapicera',      inicial: 'L', sonidos: 8 },
  lapiz:         { texto: 'lápiz',         inicial: 'L', sonidos: 5 },

  // ---- Nivel 2: contar sonidos, Actividad 1 (luna y banana ya estaban) ----
  abeja:  { texto: 'abeja',  inicial: 'A', sonidos: 5 },
  jirafa: { texto: 'jirafa', inicial: 'J', sonidos: 6 },

  // ---- Nivel 2: letra inicial, Actividad 2 ----
  dado: { texto: 'dado', inicial: 'D', sonidos: 4 },

  // ---- Nivel 2: sonido escondido, Actividad 4 (termina con el sonido N) ----
  moto:      { texto: 'moto',      inicial: 'M', sonidos: 4 },
  camion:    { texto: 'camión',    inicial: 'C', sonidos: 6 },
  auto:      { texto: 'auto',      inicial: 'A', sonidos: 4 },
  avion:     { texto: 'avión',     inicial: 'A', sonidos: 5 },
  bicicleta: { texto: 'bicicleta', inicial: 'B', sonidos: 9 },

  // ---- Nivel 3: nueva Actividad 1 ----
  casa:     { texto: 'casa',     inicial: 'C', sonidos: 4 },
  caramelo: { texto: 'caramelo', inicial: 'C', sonidos: 8 },

  // ---- Nivel 4: Actividad 2 (imágenes reales) ----
  carne:   { texto: 'carne',   inicial: 'C', sonidos: 5 },
  puente:  { texto: 'puente',  inicial: 'P', sonidos: 6, voz: 'voz/puente.mp3' },
  mosca:   { texto: 'mosca',   inicial: 'M', sonidos: 5 },
  cascara: { texto: 'cáscara', inicial: 'C', sonidos: 7 },
  carta:   { texto: 'carta',   inicial: 'C', sonidos: 5, voz: 'voz/carta.mp3' },
  fuente:  { texto: 'fuente',  inicial: 'F', sonidos: 6 },
  // Fotos reales para usar como distractores (sin R, S ni N)
  gato_foto:   { texto: 'gato',   inicial: 'G', sonidos: 4, voz: 'voz/gato.mp3' },
  pato_foto:   { texto: 'pato',   inicial: 'P', sonidos: 4, voz: 'voz/pato.mp3' },
  dado_foto:   { texto: 'dado',   inicial: 'D', sonidos: 4 },
  // Nivel 2 · Act. 1 (imagen con imagen): fotos reales. Falta grabar voz/{id}.mp3 de las nuevas.
  mesa_foto:   { texto: 'mesa',   inicial: 'M', sonidos: 4, voz: 'voz/mesa.mp3' },
  sapo_foto:   { texto: 'sapo',   inicial: 'S', sonidos: 4, voz: 'voz/sapo.mp3' },
  silla_foto:  { texto: 'silla',  inicial: 'S', sonidos: 4 },
  loro_foto:   { texto: 'loro',   inicial: 'L', sonidos: 4 },
  lechuza_foto:{ texto: 'lechuza',inicial: 'L', sonidos: 6, voz: 'voz/lechuza.mp3' },
  barco_foto:  { texto: 'barco',  inicial: 'B', sonidos: 5 },
  dinosaurio_foto:{ texto: 'dinosaurio', inicial: 'D', sonidos: 9 },
  vaca:        { texto: 'vaca',   inicial: 'V', sonidos: 4 },
  pelota_foto: { texto: 'pelota', inicial: 'P', sonidos: 6, ayuda: 'ayuda/pelota.mp3', voz: 'voz/pelota.mp3' },
  llave:       { texto: 'llave',  inicial: 'LL', sonidos: 4 },

  // ---- Nivel 4: Actividad 4 (imágenes reales) ----
  jaula:       { texto: 'jaula',    inicial: 'J', sonidos: 5, voz: 'voz/jaula.mp3' },
  taza:        { texto: 'taza',     inicial: 'T', sonidos: 4 },
  estatua:     { texto: 'estatua',  inicial: 'E', sonidos: 7 },
  iguana_foto: { texto: 'iguana',   inicial: 'I', sonidos: 6, voz: 'voz/iguana.mp3' },
  noche:       { texto: 'noche',    inicial: 'N', sonidos: 4, llenar: true },

  // ---- Nivel 3 (fotos reales). Archivos de audio con el nombre simple: voz/{palabra}.mp3 y ayuda/{palabra}.mp3 ----
  cocodrilo_foto: { texto: 'cocodrilo', inicial: 'C', sonidos: 9, ayuda: 'ayuda/cocodrilo.mp3', voz: 'voz/cocodrilo.mp3' },
  colibri_foto:   { texto: 'colibrí', inicial: 'C', sonidos: 7, ayuda: 'ayuda/colibri.mp3', voz: 'voz/colibri.mp3' },
  perro_foto:     { texto: 'perro', inicial: 'P', sonidos: 4, ayuda: 'ayuda/perro.mp3', voz: 'voz/perro.mp3' },
  pez_foto:       { texto: 'pez', inicial: 'P', sonidos: 3, ayuda: 'ayuda/pez.mp3', voz: 'voz/pez.mp3' },
  tigre_foto:     { texto: 'tigre', inicial: 'T', sonidos: 5, ayuda: 'ayuda/tigre.mp3', voz: 'voz/tigre.mp3' },
  tortuga_foto:   { texto: 'tortuga', inicial: 'T', sonidos: 7, ayuda: 'ayuda/tortuga.mp3', voz: 'voz/tortuga.mp3' },
  tenedor_foto:   { texto: 'tenedor', inicial: 'T', sonidos: 7, ayuda: 'ayuda/tenedor.mp3', voz: 'voz/tenedor.mp3' },
  cuchara_foto:   { texto: 'cuchara', inicial: 'C', sonidos: 5, ayuda: 'ayuda/cuchara.mp3', voz: 'voz/cuchara.mp3' },
  peine_foto:     { texto: 'peine', inicial: 'P', sonidos: 5, ayuda: 'ayuda/peine.mp3', voz: 'voz/peine.mp3' },
  cama_foto:      { texto: 'cama', inicial: 'C', sonidos: 4, ayuda: 'ayuda/cama.mp3', voz: 'voz/cama.mp3' },
  puerta_foto:    { texto: 'puerta', inicial: 'P', sonidos: 6, ayuda: 'ayuda/puerta.mp3', voz: 'voz/puerta.mp3' },
  tomate_foto:    { texto: 'tomate', inicial: 'T', sonidos: 6, ayuda: 'ayuda/tomate.mp3', voz: 'voz/tomate.mp3' },
  rata_foto:      { texto: 'rata', inicial: 'R', sonidos: 4, ayuda: 'ayuda/rata.mp3', voz: 'voz/rata.mp3' },
  copa_foto:      { texto: 'copa', inicial: 'C', sonidos: 4, ayuda: 'ayuda/copa.mp3', voz: 'voz/copa.mp3' },
  conejo_foto:    { texto: 'conejo', inicial: 'C', sonidos: 6, ayuda: 'ayuda/conejo.mp3', voz: 'voz/conejo.mp3' },
  vela_foto:      { texto: 'vela', inicial: 'V', sonidos: 4, ayuda: 'ayuda/vela.mp3', voz: 'voz/vela.mp3' },
  pan_foto:       { texto: 'pan', inicial: 'P', sonidos: 3, ayuda: 'ayuda/pan.mp3', voz: 'voz/pan.mp3' },
  casa_foto:      { texto: 'casa', inicial: 'C', sonidos: 4, ayuda: 'ayuda/casa.mp3', voz: 'voz/casa.mp3' },
  lata_foto:      { texto: 'lata', inicial: 'L', sonidos: 4, ayuda: 'ayuda/lata.mp3', voz: 'voz/lata.mp3' },
  caracol_foto:   { texto: 'caracol', inicial: 'C', sonidos: 7, ayuda: 'ayuda/caracol.mp3', voz: 'voz/caracol.mp3' },

  // ---- Nivel 4 (fotos nuevas): voz/ y ayuda/ con nombre simple ----
  bruja_foto:     { texto: 'bruja',  inicial: 'B', sonidos: 5, ayuda: 'ayuda/bruja.mp3',  voz: 'voz/bruja.mp3' },
  ogro_foto:      { texto: 'ogro',   inicial: 'O', sonidos: 4, ayuda: 'ayuda/ogro.mp3',   voz: 'voz/ogro.mp3' },
  tren_foto:      { texto: 'tren',   inicial: 'T', sonidos: 4, ayuda: 'ayuda/tren.mp3',   voz: 'voz/tren.mp3' },
  clavo_foto:     { texto: 'clavo',  inicial: 'C', sonidos: 5, ayuda: 'ayuda/clavo.mp3',  voz: 'voz/clavo.mp3' },
  dragon_foto:    { texto: 'dragón', inicial: 'D', sonidos: 6, ayuda: 'ayuda/dragon.mp3', voz: 'voz/dragon.mp3' },
  payaso_foto:    { texto: 'payaso', inicial: 'P', sonidos: 6 },

  // ---- Animales ----
  flamenco: { texto: 'flamenco', inicial: 'F', sonidos: 8 },
  foca:     { texto: 'foca',     inicial: 'F', sonidos: 4 },
  lechuza:  { texto: 'lechuza',  inicial: 'L', sonidos: 6 },
  leon:     { texto: 'león',     inicial: 'L', sonidos: 4 },
  cebra:    { texto: 'cebra',    inicial: 'C', sonidos: 5 },
  ciervo:   { texto: 'ciervo',   inicial: 'C', sonidos: 6 },
  tigre:    { texto: 'tigre',    inicial: 'T', sonidos: 5 },
  tortuga:  { texto: 'tortuga',  inicial: 'T', sonidos: 7 },
  mariposa: { texto: 'mariposa', inicial: 'M', sonidos: 8 },
  mono:     { texto: 'mono',     inicial: 'M', sonidos: 4 },

  // ---- Colores (se muestran como un cuadro de color, sin imagen) ----
  rojo:     { texto: 'rojo',     inicial: 'R', sonidos: 4, color: '#E4162A' },
  rosa:     { texto: 'rosa',     inicial: 'R', sonidos: 4, color: '#FF5C8A' },
  verde:    { texto: 'verde',    inicial: 'V', sonidos: 5, color: '#16A34A' },
  violeta:  { texto: 'violeta',  inicial: 'V', sonidos: 7, color: '#7C3AED' },
  amarillo: { texto: 'amarillo', inicial: 'A', sonidos: 7, color: '#F5C400' },
  azul:     { texto: 'azul',     inicial: 'A', sonidos: 4, color: '#1D5FE0' },
  naranja:  { texto: 'naranja',  inicial: 'N', sonidos: 7, color: '#F2670C' },
  negro:    { texto: 'negro',    inicial: 'N', sonidos: 5, color: '#1C1C1C' },
};
