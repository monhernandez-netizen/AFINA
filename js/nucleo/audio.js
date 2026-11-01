/* ============================================================
   NÚCLEO · sonidos
   - Efectos (tic / acierto / error): los fabrica el navegador,
     no usan archivos.
   - Grabaciones (letras, ayudas, consignas): archivos .mp3.
   ============================================================ */
window.AS = window.AS || {};

AS.audio = (function(){

  let ctx = null;
  function contexto(){
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tic(){
    const c = contexto();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.12);
  }

  // Aplauso: muchos "palmazos" cortitos (ruido filtrado) en momentos al azar.
  function aplauso(duracion, volumen, retraso){
    const c = contexto();
    const t0 = c.currentTime + (retraso || 0);
    const largo = Math.floor(c.sampleRate * 0.06);
    const buffer = c.createBuffer(1, largo, c.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < largo; i++) datos[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / largo, 3);
    const palmas = Math.round(duracion * 28);
    for (let k = 0; k < palmas; k++){
      // La intensidad sube rápido y se va apagando al final (como un aplauso de verdad)
      const u = Math.random();
      const t = t0 + u * duracion;
      const envolvente = Math.min(1, u * 6) * Math.min(1, (1 - u) * 2.2 + 0.15);
      const fuente = c.createBufferSource();
      fuente.buffer = buffer;
      fuente.playbackRate.value = 0.8 + Math.random() * 0.6;
      const filtro = c.createBiquadFilter();
      filtro.type = 'bandpass';
      filtro.frequency.value = 1400 + Math.random() * 2600;
      filtro.Q.value = 0.8;
      const g = c.createGain();
      g.gain.value = volumen * envolvente * (0.5 + Math.random() * 0.5);
      fuente.connect(filtro); filtro.connect(g); g.connect(c.destination);
      fuente.start(t);
    }
  }

  // Campanita alegre: notas que suben, con brillo
  function campanita(notas, paso, volumen){
    const c = contexto();
    notas.forEach((freq, i) => {
      const t0 = c.currentTime + i * paso;
      [1, 2].forEach((mult, j) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = j === 0 ? 'triangle' : 'sine';
        o.frequency.value = freq * mult;
        const v = volumen * (j === 0 ? 1 : 0.35);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(v, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);
        o.connect(g); g.connect(c.destination);
        o.start(t0); o.stop(t0 + 0.5);
      });
    });
  }

  // Acierto: campanita alegre + aplauso cortito + lluvia de estrellitas
  function acierto(){
    campanita([523.25, 659.25, 783.99, 1046.5], 0.09, 0.2);
    aplauso(0.9, 0.32, 0.12);
    if (AS.efectos) AS.efectos.estrellitas();
  }

  // Final de la actividad: fanfarria tipo "¡tatán!" + aplauso largo + confeti
  function fanfarria(){
    campanita([523.25, 659.25, 783.99], 0.13, 0.22);
    const c = contexto();
    // acorde final, largo y brillante
    [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
      const t0 = c.currentTime + 0.5;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + 1.5);
    });
    aplauso(3.2, 0.4, 0.45);
    if (AS.efectos) AS.efectos.confeti();
  }

  function error(){
    const c = contexto();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(180, c.currentTime);
    o.frequency.linearRampToValueAtTime(110, c.currentTime + 0.28);
    g.gain.setValueAtTime(0.16, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.3);
  }

  // Bocina de error: fuerte y bien distinta al "error" suave de las otras
  // actividades. Dos tonos graves juntos, como una bocina de auto.
  function bocina(){
    const c = contexto();
    const t0 = c.currentTime;
    const maestro = c.createGain();
    maestro.gain.setValueAtTime(0.0001, t0);
    maestro.gain.exponentialRampToValueAtTime(0.55, t0 + 0.02);
    maestro.gain.setValueAtTime(0.55, t0 + 0.5);
    maestro.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.62);
    const filtro = c.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 1800;
    maestro.connect(filtro); filtro.connect(c.destination);
    [349.2, 440].forEach(freq => {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.connect(maestro);
      o.start(t0); o.stop(t0 + 0.65);
    });
  }

  // Avisito "todavía no tiene sonido grabado"
  let temporizador = null;
  function avisoSinSonido(){
    const aviso = document.getElementById('aviso');
    if (!aviso) return;
    aviso.classList.add('show');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => aviso.classList.remove('show'), 1600);
  }

  // Reproduce un archivo; si no existe, muestra el avisito
  function reproducir(ruta){
    const a = new Audio(ruta);
    a.play().catch(avisoSinSonido);
    return a;
  }

  // Deja un audio listo para reproducirse al instante (para las letras)
  function precargar(ruta){
    const a = new Audio(ruta);
    a.preload = 'auto';
    return a;
  }

  // Lee un texto en voz alta con la síntesis de voz del navegador (para las
  // consignas: como quienes usan la app todavía no saben leer, el botón de
  // "escuchar la consigna" no depende de grabar un audio por actividad,
  // lee directamente el texto que está escrito en niveles.js).
  function leerTexto(texto){
    if (!texto || !('speechSynthesis' in window)){ avisoSinSonido(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-AR';
    u.rate = 0.92;
    u.pitch = 1;
    u.onerror = avisoSinSonido;
    window.speechSynthesis.speak(u);
  }

  // Consigna: suena la grabación si existe; si no, la voz del navegador
  let consignaActual = null;
  function leerConsigna(ruta, texto){
    if (consignaActual){ consignaActual.pause(); consignaActual = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const a = new Audio(ruta);
    consignaActual = a;
    a.play().catch(() => { if (consignaActual === a) leerTexto(texto); });
  }

  return { tic, acierto, fanfarria, aplauso, error, bocina, avisoSinSonido, reproducir, precargar, leerTexto, leerConsigna };
})();
