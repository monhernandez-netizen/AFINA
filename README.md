# AFINA

**Alfabetización Fónica Interactiva Nivelada para Adolescentes**

*Afiná el oído, aprendé a leer.*

AFINA es una aplicación web para entrenar la conciencia fonológica jugando: escuchar, discriminar sonidos, unir imágenes con letras y palabras, contar sonidos y escribir. Está pensada para adolescentes que están aprendiendo a leer y escribir.

Trabajo final de la Licenciatura en Alfabetización Inicial · UNaHur.

**Probala acá:** https://monhernandez-netizen.github.io/alfabeto-sonoro/

## Qué tiene

- **4 niveles**, cada uno con **4 actividades** (16 en total), que van de menos a más dificultad.
- Cada consigna y cada tarjeta tiene un **parlante** para escucharla; no hace falta saber leer para usarla.
- Teclado de ayuda con el sonido de cada letra.
- Festejos al terminar cada actividad.
- No pide registro ni guarda datos de quien la usa.

## Cómo usarla

| Quiero… | Qué hago |
|---|---|
| **Usarla en línea** | Abrir el link de arriba en el navegador (celular, tablet o computadora). No hace falta instalar nada. |
| **Instalarla en el celular** | Abrir el link con **Chrome** (Android) y elegir *Instalar app*, o con **Safari** (iPhone) y elegir *Agregar a pantalla de inicio*. |
| **Usarla sin internet** | Instalarla (o abrirla) **una vez con internet**. Queda guardada en el dispositivo y después funciona sin conexión. |
| **Usarla desde una carpeta** | Descargar el repositorio, descomprimir y abrir `index.html` con el navegador. |

**Importante:** la primera vez hace falta internet para que se guarden todas las imágenes y audios (unos 23 MB). Las tipografías se descargan de Google Fonts; sin conexión se usa una tipografía común del dispositivo y todo sigue funcionando.

## Cómo se actualiza

Cada cambio que se sube a este repositorio se publica solo en la página en uno o dos minutos. En los celulares que ya la tienen instalada, la versión nueva se ve **la segunda vez que se abre la app con internet**. Para forzarla, se desinstala y se vuelve a instalar.

Quien edita el proyecto debe cambiar `VERSION` en `sw.js` (por ejemplo, de `afina-v4` a `afina-v5`) cada vez que modifique cualquier archivo, para que los dispositivos descarguen la versión nueva.

## Cómo agregar o cambiar contenido

Todo lo que se edita está en `contenido/`:

- `palabras.js`: catálogo de palabras (texto, letra inicial, cantidad de sonidos).
- `niveles.js`: qué actividades tiene cada nivel y con qué palabras.
- `letras.js`: letras del teclado de ayuda.
- `config.js`: título, subtítulo y textos de la pantalla principal.

Para revisar que no falte ninguna imagen ni audio, abrir la app agregando `?revisar` al final del link.

## Estructura

- `contenido/`: palabras, letras y niveles.
- `js/` y `css/`: funcionamiento y diseño.
- `images/`, `voz/`, `sounds/`, `ayuda/`, `consignas/`: fotos y audios.
- `icons/`, `manifest.webmanifest`, `sw.js`: ícono y versión instalable (funciona sin conexión).
- `version-anterior/`: versión previa del proyecto, conservada como archivo.

## Créditos

Diseño, contenido y desarrollo: Betty · Trabajo final de la Licenciatura en Alfabetización Inicial, Universidad Nacional de Hurlingham (UNaHur).
