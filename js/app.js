/* ============================================================
   ARRANQUE
   Se ejecuta al final, cuando ya está cargado todo lo demás.
   ============================================================ */
(function(){
  AS.validar();
  if (/[?&]revisar/.test(location.search)) AS.revisar();
  else AS.pantallas.inicio();
})();
