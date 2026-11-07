/* ============================================================
   NIVELES Y ACTIVIDADES  ← ESTE ES EL ARCHIVO QUE SE TOCA
   ------------------------------------------------------------
   Toda la app se arma leyendo esta lista. Para hacer cambios:

   • MOVER una actividad de lugar (dentro de un nivel o a otro
     nivel): cortá el bloque { ... } completo y pegalo donde
     corresponda. El número de actividad, el título de la pantalla
     y el color se ajustan solos.

   • CAMBIAR las palabras de una actividad: editá la lista
     "palabras" (o "izquierda" / "derecha"). Los nombres tienen que
     existir en contenido/palabras.js.

   • AGREGAR una actividad: copiá un bloque, dale un "id" nuevo
     (sin repetir) y cambiá lo que haga falta.

   • DEJAR un casillero "Ya viene": simplemente no pongas actividad
     (el menú completa con "Ya viene" hasta 4), o agregá
     { id: '...', tipo: 'contar-sonidos', proximamente: true }.

   Tipos de actividad disponibles:
     'contar-sonidos'   ¿cuántos sonidos tiene la palabra?   → palabras
     'letra-inicial'    ¿con qué letra comienza?             → palabras
     'unir-igual'       ¿cuál empieza igual? (arrastrar)     → izquierda, derecha
     'completar-vocales' completar las vocales que faltan     → palabras
     'sonido-letras'    teclado con el sonido de cada letra  → letras o habilitadas (opcional)
     'escribir-palabra' mirar el dibujo y escribir la palabra → palabras, cajas (opcional)

   Campos de cada actividad (todos opcionales menos id y tipo):
     id             nombre único, no se repite.
     titulo         reemplaza el título estándar del tipo
     consigna       reemplaza la consigna estándar. El botoncito de
                    parlante que está al lado la lee en voz alta con la
                    voz del navegador (no hace falta grabar ni un audio):
                    si cambiás este texto, lo que se escucha cambia solo.
     consignaVoz    (opcional) texto que se LEE en voz alta si es distinto del que
                    se ve en pantalla (por ejemplo, para incluir la pregunta del título)
     mensajeFinal   texto de la pantalla "¡Completaste esta actividad!"
     derechaLetras  (solo 'unir-igual') ['A','E','I','O','U'] = la columna
                    derecha muestra letras mayúsculas en lugar de imágenes
     tarjetasGrandes (solo 'unir-igual') true = tarjetas más altas, para
                    que se vean mejor las imágenes
     botonSonido    ('unir-igual' y 'completar-vocales') true = parlantito
                    que dice la palabra (voz/{id}.mp3)
   ============================================================ */
window.AS = window.AS || {};

AS.niveles = [

  // ==========================================================
  {
    id: 'nivel1',
    titulo: 'Nivel 1',
    color: 'verde',        // color de la tarjeta: 'verde' o 'azul'
    acento: '#05A3C8',     // color de detalles dentro del nivel (botones, puntos)
    // Teclado de ayuda (botón con dibujo de teclado): qué grupos de letras SUENAN.
    // Grupos: 'vocal', 'prolongable', 'explosiva', 'otra' (ver contenido/letras.js).
    // Las demás letras se ven, pero apagadas. 'todas' = completo.
    teclado: ['vocal'],
    actividades: [

      // Act. 1: sonido inicial, vocales (fotos reales).
      // Cada imagen tiene un parlantito: al tocarlo suena la palabra (voz/{id}.mp3).
      // Arrastrar la imagen no hace sonar nada.
      { id: 'unir-vocales',
        tipo: 'unir-igual',
        titulo: 'Sonido inicial',
        consigna: 'Arrastrá la imagen sobre otra que empiece con el mismo sonido',
        mensajeFinal: 'Uniste todas las imágenes que empiezan con la misma vocal.',
        botonSonido: true,
        tarjetasGrandes: true,
        // Fotos reales (ids terminados en _foto). Los dibujos anteriores
        // siguen en images/ por si querés volver: elefante, oso, uva, iman,
        // arana, estufa, olla, una, iguana, anillo.
        izquierda: ['elefante_foto', 'oso_foto', 'uva_foto', 'iman_foto', 'arana_foto'],
        derecha:   ['estufa_foto', 'olla_foto', 'una_foto', 'iguana_foto', 'anillo_foto'] },

      // Act. 2 (NUEVA): unir cada imagen con la VOCAL MAYÚSCULA de imprenta
      // que suena como su sonido inicial. Una imagen por vocal (de las de la
      // Act. 1). Cada imagen tiene su parlantito para sumar el audio después.
      { id: 'unir-imagen-letra',
        tipo: 'unir-igual',
        titulo: 'Sonido inicial y letra',
        consigna: 'Arrastrá la imagen sobre la letra que suena como su sonido inicial',
        mensajeFinal: 'Uniste cada imagen con la letra de su sonido inicial.',
        botonSonido: true,
        tarjetasGrandes: true,
        izquierda: ['anillo_foto', 'elefante_foto', 'iman_foto', 'oso_foto', 'uva_foto'],
        derechaLetras: ['A', 'E', 'I', 'O', 'U'] },

      // Act. 3: reconocimiento de vocales (antes Act. 4). Suena el sonido de
      // una vocal (sin dibujo ni pista visual) y el chico toca cuál escuchó.
      { id: 'dictado-vocales',
        tipo: 'dictado-letras',
        titulo: 'Reconocimiento de vocales fonema-grafema',
        consigna: 'Escuchá el sonido y tocá la vocal que corresponde',
        mensajeFinal: 'Completaste el reconocimiento de vocales.',
        letras: ['a', 'e', 'i', 'o', 'u'] },

      // Act. 4: completar los sonidos que faltan (antes Act. 2). Se ve la
      // palabra sin vocales y el chico toca la vocal que falta. Si se
      // equivoca suena la bocina de error.
      { id: 'completar-vocales-1',
        tipo: 'completar-vocales',
        titulo: 'Completá los sonidos',
        consigna: 'Mirá el dibujo y completá los sonidos que faltan',
        mensajeFinal: 'Completaste los sonidos de todas las palabras.',
        botonSonido: true,
        palabras: ['pelota', 'paloma', 'mesa', 'sapo', 'gato'] },

      // ACTIVIDAD GUARDADA (sale del Nivel 1): tablero con solo las vocales
      // habilitadas (con su sonido). Para volver a usarla, pegá el bloque
      // dentro de la lista "actividades" de un nivel.
      //
      // { id: 'teclado-vocales',
      //   tipo: 'sonido-letras',
      //   titulo: 'El sonido de las vocales',
      //   consigna: 'Tocá una vocal y escuchá su sonido',
      //   habilitadas: ['a', 'e', 'i', 'o', 'u'] },

      // ACTIVIDAD GUARDADA (versión anterior, no se muestra): para volver a
      // usarla, pegá el bloque dentro de la lista "actividades" de un nivel.
      //
      // { id: 'contar-cvcv',
      //   tipo: 'contar-sonidos',
      //   consigna: 'Palabras cortas (CVCV) · Mirá el dibujo y tocá una vez por cada sonido',
      //   mensajeFinal: 'Contaste los sonidos de todas las palabras cortas.',
      //   palabras: ['pato', 'mesa', 'sapo', 'luna', 'gato'] },
      //
      // { id: 'inicial-cvcv',
      //   tipo: 'letra-inicial',
      //   palabras: ['pato', 'mesa', 'sapo', 'luna', 'gato'] },
      //
      // { id: 'unir-colores',
      //   tipo: 'unir-igual',
      //   consigna: 'Arrastrá cada color hasta el que empieza con la misma letra',
      //   mensajeFinal: 'Uniste todos los colores que empiezan con la misma letra.',
      //   izquierda: ['rojo', 'verde', 'amarillo', 'naranja'],
      //   derecha:   ['rosa', 'violeta', 'azul', 'negro'] },

    ],
  },

  // ==========================================================
  {
    id: 'nivel2',
    titulo: 'Nivel 2',
    color: 'azul',
    acento: '#7C6CE8',
    // Teclado de ayuda (botón con dibujo de teclado): qué grupos de letras SUENAN.
    // Grupos: 'vocal', 'prolongable', 'explosiva', 'otra' (ver contenido/letras.js).
    // Las demás letras se ven, pero apagadas. 'todas' = completo.
    teclado: ['vocal', 'prolongable'],
    actividades: [

      // Act. 1: imagen con imagen. Se arrastra una imagen
      // sobre otra que empiece con el mismo sonido. Fotos reales; cada imagen
      // tiene su parlantito (voz/{id}.mp3).
      { id: 'unir-imagen-imagen',
        tipo: 'unir-igual',
        titulo: 'Imagen con imagen',
        consigna: 'Arrastrá la imagen sobre otra que empiece con el mismo sonido',
        mensajeFinal: 'Uniste todas las imágenes que empiezan con el mismo sonido.',
        botonSonido: true,
        tarjetasGrandes: true,
        // 5 parejas por sonido inicial: M · S · L · B · D
        izquierda: ['mono_foto', 'sapo_foto', 'loro_foto', 'barco_foto', 'dinosaurio_foto'],
        derecha:   ['mesa_foto', 'silla_foto', 'lechuza_foto', 'banana_foto', 'dado_foto'] },

      // Act. 2: sonido inicial (¿con qué letra empieza?), ahora con fotos reales.
      // Cada imagen tiene su parlantito (voz/{id}.mp3).
      // Dibujos anteriores en images/: dado, sol, leon, mariposa, foca.
      { id: 'inicial-1',
        tipo: 'letra-inicial',
        consigna: 'Mirá el dibujo y tocá la letra con la que comienza',
        // consignaVoz: lo que se LEE en voz alta (incluye la pregunta del título).
        consignaVoz: '¿Con qué letra comienza? Mirá el dibujo y tocá la letra con la que comienza',
        palabras: ['dado_foto', 'sol_foto', 'leon_foto', 'mariposa_foto', 'foca_foto'] },

      // Act. 3: sonido final (antes era la Act. 4). Tres rondas de 4 imágenes
      // con UNA sola correcta: termina en N, en S y en R.
      // Cada imagen tiene su parlantito (voz/{id}.mp3).
      { id: 'sonido-escondido-1',
        tipo: 'sonido-escondido',
        titulo: 'Sonido final',
        consigna: 'Tocá la imagen que tenga al final el sonido que escuchás',
        rondas: [
          { letra: 'n', correctas: ['camion'],  incorrectas: ['moto', 'auto', 'bicicleta'] },
          { letra: 's', correctas: ['compas'],  incorrectas: ['regla', 'cuaderno', 'lapicera'] },
          { letra: 'r', correctas: ['tambor'],  incorrectas: ['guitarra', 'flauta', 'piano'] },
        ] },

      // Act. 4: contar sonidos (antes era la Act. 1). Fotos reales; el parlante
      // el parlante sobre la imagen dice la palabra (ayuda/{id}.mp3).
      { id: 'contar-sonidos-1',
        tipo: 'contar-sonidos',
        // Dibujos anteriores en images/: luna, banana, abeja, momia, mono.
        palabras: ['luna_foto', 'banana_foto', 'abeja_foto', 'momia_foto', 'mono_foto'] },

      // ACTIVIDAD GUARDADA (sale del Nivel 2): tablero de letras. Pasa a ser
      // una ayuda en todas las actividades (pendiente).
      //
      // { id: 'teclado-nivel2',
      //   tipo: 'sonido-letras',
      //   titulo: 'El sonido de las letras',
      //   consigna: 'Tocá una letra y escuchá su sonido',
      //   habilitadas: ['a', 'e', 'i', 'o', 'u', 'b', 'd', 'f', 'g', 'j', 'l', 'm', 'n', 'r', 's', 'v', 'z'] },
      //
      // Sonido final con la N con avión (versión anterior, 5 imágenes):
      // { letra: 'n', correctas: ['camion', 'avion'], incorrectas: ['moto', 'auto', 'bicicleta'] },

      // ACTIVIDAD GUARDADA (versión anterior, no se muestra): para volver a
      // usarla, pegá el bloque dentro de la lista "actividades" de un nivel.
      //
      // { id: 'unir-utiles',
      //   tipo: 'unir-igual',
      //   consigna: 'Arrastrá cada útil hasta el que empieza con la misma letra',
      //   mensajeFinal: 'Uniste todos los útiles que empiezan con la misma letra.',
      //   izquierda: ['cuaderno_rojo', 'compas', 'transportador', 'plasticola', 'lapicera'],
      //   derecha:   ['cuaderno', 'crayones', 'tijera', 'pincel', 'lapiz'] },

    ],
  },

  // ==========================================================
  {
    id: 'nivel3',
    titulo: 'Nivel 3',
    color: 'azul',
    acento: '#F2A430',
    // Teclado de ayuda (botón con dibujo de teclado): qué grupos de letras SUENAN.
    // Grupos: 'vocal', 'prolongable', 'explosiva', 'otra' (ver contenido/letras.js).
    // Las demás letras se ven, pero apagadas. 'todas' = completo.
    teclado: ['vocal', 'prolongable', 'explosiva'],
    actividades: [

      // Act. 1: imagen con imagen (fotos reales, 4 parejas por sonido inicial).
      // Cada imagen tiene su parlantito (voz/{palabra}.mp3).
      { id: 'unir-imagen-imagen-3',
        tipo: 'unir-igual',
        titulo: 'Imagen con imagen',
        consigna: 'Arrastrá la imagen sobre otra que empiece con el mismo sonido',
        mensajeFinal: 'Uniste todas las imágenes que empiezan con el mismo sonido.',
        botonSonido: true,
        tarjetasGrandes: true,
        // cocodrilo-colibrí · lechuza-león · perro-pez · tigre-tortuga
        izquierda: ['cocodrilo_foto', 'lechuza_foto', 'perro_foto', 'tigre_foto'],
        derecha:   ['colibri_foto', 'leon_foto', 'pez_foto', 'tortuga_foto'] },

      // Act. 2: imagen con letra. La C de cuchara y cama suena fuerte (ca-co-cu):
      // su parlantito usa sounds/ca-co-cu.mp3 (hay que grabarlo).
      { id: 'unir-imagen-letra-3',
        tipo: 'unir-igual',
        titulo: 'Sonido inicial y letra',
        consigna: 'Arrastrá la imagen sobre la letra que suena como su sonido inicial',
        mensajeFinal: 'Uniste cada imagen con la letra de su sonido inicial.',
        botonSonido: true,
        tarjetasGrandes: true,
        // tenedor-T · cuchara-C · peine-P · cama-C · puerta-P · tomate-T
        izquierda: ['tenedor_foto', 'cuchara_foto', 'peine_foto', 'cama_foto', 'puerta_foto', 'tomate_foto'],
        derechaLetras: ['T', { letra: 'C', sonido: 'ca-co-cu' }, 'P', { letra: 'C', sonido: 'ca-co-cu' }, 'T', 'P'] },

      // Act. 3: sonido escondido con S · T · P · N · L. En cada ronda hay 4 imágenes
      // y una sola tiene el sonido (mosca-S, rata-T, copa-P, conejo-N, vela-L).
      { id: 'sonido-escondido-3',
        tipo: 'sonido-escondido',
        titulo: 'Encontrá el sonido escondido',
        consigna: 'Tocá la imagen que tenga en el medio el sonido que escuchás',
        consignaVoz: 'Encontrá el sonido escondido. Tocá la imagen que tenga en el medio el sonido que escuchás',
        mensajeFinal: 'Encontraste todos los sonidos escondidos.',
        rondas: [
          { letra: 's', correctas: ['mosca'],       incorrectas: ['rata_foto', 'copa_foto', 'vela_foto'] },
          { letra: 't', correctas: ['rata_foto'],   incorrectas: ['conejo_foto', 'vela_foto', 'mosca'] },
          { letra: 'p', correctas: ['copa_foto'],   incorrectas: ['vela_foto', 'mosca', 'rata_foto'] },
          { letra: 'n', correctas: ['conejo_foto'], incorrectas: ['mosca', 'rata_foto', 'copa_foto'] },
          { letra: 'l', correctas: ['vela_foto'],   incorrectas: ['copa_foto', 'conejo_foto', 'mosca'] },
        ] },

      // Act. 4: contar sonidos (pan, casa, pelota, lata, caracol).
      // Falta grabar ayuda/{palabra}.mp3 de cada una (parlante sobre la imagen).
      { id: 'contar-sonidos-3',
        tipo: 'contar-sonidos',
        palabras: ['pan_foto', 'casa_foto', 'pelota_foto', 'lata_foto', 'caracol_foto'] },

      // ---------- ACTIVIDADES GUARDADAS (versión anterior del Nivel 3, no se muestran) ----------
      // Para volver a usarlas, pegá el bloque dentro de la lista "actividades" y cambiá el id si se repite.
      //
      //
      // NUEVA: contar sonidos con payaso, pelota, tomate, casa y caramelo.
      // Falta grabar ayuda/{id}.mp3 de cada una (parlante sobre la imagen).
      // { id: 'contar-sonidos-3',
      // tipo: 'contar-sonidos',
      // palabras: ['payaso', 'pelota', 'tomate', 'casa', 'caramelo'] },
      //
      // { id: 'inicial-terror-2',
      // tipo: 'letra-inicial',
      // palabras: ['vivora', 'momia', 'esqueleto', 'arana', 'murcielago'] },
      //
      // NUEVA: tablero completo (todas las letras habilitadas).
      // { id: 'teclado-completo',
      // tipo: 'sonido-letras',
      // titulo: 'El sonido de las letras',
      // consigna: 'Tocá una letra y escuchá su sonido' },
      //
      // { id: 'unir-animales',
      // tipo: 'unir-igual',
      // consigna: 'Uní las que empiezan con el mismo sonido',
      // mensajeFinal: 'Uniste todos los animales que empiezan con la misma letra.',
      // botonSonido: true,
      // izquierda: ['pato', 'lechuza', 'tigre', 'mariposa'],
      // derecha:   ['paloma', 'leon', 'tortuga', 'mono'] },
      //
      //
    ],
  },

  // ==========================================================
  {
    id: 'nivel4',
    titulo: 'Nivel 4',
    color: 'verde',
    acento: '#05A3C8',
    // Teclado de ayuda (botón con dibujo de teclado): qué grupos de letras SUENAN.
    // Grupos: 'vocal', 'prolongable', 'explosiva', 'otra' (ver contenido/letras.js).
    // Las demás letras se ven, pero apagadas. 'todas' = completo.
    teclado: 'todas',
    actividades: [

      // Act. 1 (NUEVA): imagen con PALABRA ESCRITA. Se arrastra la foto sobre la
      // etiqueta con su palabra (mayúsculas de imprenta). Cada imagen y cada
      // etiqueta tienen su parlantito (voz/{palabra}.mp3).
      { id: 'unir-imagen-palabra',
        tipo: 'unir-igual',
        titulo: 'Imagen y palabra',
        consigna: 'Arrastrá la imagen sobre la palabra correcta',
        mensajeFinal: 'Uniste cada imagen con su palabra.',
        botonSonido: true,
        tarjetasGrandes: true,
        // bruja · tren · globo · jaula · ogro
        izquierda: ['bruja_foto', 'tren_foto', 'globo', 'jaula', 'ogro_foto'],
        derechaPalabras: ['bruja_foto', 'tren_foto', 'globo', 'jaula', 'ogro_foto'] },

      // Act. 2: sonido MEDIAL. 4 imágenes por ronda y UNA sola tiene el sonido
      // en el medio de la palabra: puente-N, carta-R, mosca-S, vela-L, cama-M.
      // El parlante reproduce sounds/{letra}.mp3.
      { id: 'sonido-medial-4',
        tipo: 'sonido-escondido',
        titulo: 'Encontrá el sonido escondido',
        consigna: 'Tocá la imagen que tenga en el medio el sonido que escuchás',
        consignaVoz: 'Encontrá el sonido escondido. Tocá la imagen que tenga en el medio el sonido que escuchás',
        mensajeFinal: 'Encontraste todos los sonidos escondidos.',
        rondas: [
          { letra: 'n', correctas: ['puente'],      incorrectas: ['carta', 'mosca', 'vela_foto'] },
          { letra: 'r', correctas: ['carta'],       incorrectas: ['jaula', 'globo', 'vela_foto'] },
          { letra: 's', correctas: ['mosca'],       incorrectas: ['cama_foto', 'bruja_foto', 'ogro_foto'] },
          { letra: 'l', correctas: ['vela_foto'],   incorrectas: ['puente', 'tren_foto', 'payaso_foto'] },
          { letra: 'm', correctas: ['cama_foto'],   incorrectas: ['puente', 'carta', 'vela_foto'] },
        ] },

      // Act. 3: contar sonidos (antes Act. 1). Cambios: choclo → clavo, sol → dragón.
      // Falta grabar ayuda/{palabra}.mp3 de plato, globo, clavo, dragon y tren.
      { id: 'contar-trabadas',
        tipo: 'contar-sonidos',
        sinParlantePalabra: true,
        palabras: ['plato', 'globo', 'clavo_foto', 'dragon_foto', 'tren_foto'] },

      // Act. 4: escribir la palabra mirando la imagen (las mismas 5 de la Act. 1).
      // "cajas: true" muestra una caja por letra (la cantidad justa).
      { id: 'escribir-palabra-1',
        tipo: 'escribir-palabra',
        titulo: 'Escribí la palabra',
        consigna: 'Mirá el dibujo y escribí la palabra',
        mensajeFinal: 'Escribiste todas las palabras.',
        cajas: true,
        palabras: ['bruja_foto', 'tren_foto', 'globo', 'jaula', 'ogro_foto'] },

      // ---------- ACTIVIDADES GUARDADAS (versión anterior del Nivel 4, no se muestran) ----------
      // Para volver a usarlas, pegá el bloque dentro de la lista "actividades".
      //
      // El teclado completo (pasa a ser una ayuda en todas las actividades; pendiente):
      // { id: 'sonido-letras',
      //   tipo: 'sonido-letras' },
      //
      // Sonido escondido anterior (R, S, N con dos correctas por ronda):
      // { id: 'sonido-escondido-r',
      //   tipo: 'sonido-escondido',
      //   titulo: 'Encontrá el sonido escondido',
      //   consigna: 'Tocá las imágenes que tengan este sonido',
      //   mensajeFinal: 'Encontraste los sonidos escondidos.',
      //   rondas: [
      //     { letra: 'r', correctas: ['carne', 'carta'],     incorrectas: ['gato_foto', 'vaca'] },
      //     { letra: 's', correctas: ['mosca', 'cascara'],   incorrectas: ['pato_foto', 'dado_foto'] },
      //     { letra: 'n', correctas: ['puente', 'fuente'],   incorrectas: ['pelota_foto', 'llave'] },
      //   ] },
      //
      // Contar sonidos anterior: palabras: ['plato', 'globo', 'choclo', 'sol', 'tren']
      // Escribir anterior:       palabras: ['jaula', 'taza', 'estatua', 'iguana_foto', 'noche']

    ],
  },

];
