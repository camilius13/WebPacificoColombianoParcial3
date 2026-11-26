/* Contenido de los juegos. Edita textos y nombres de archivo aquí.
   Las imágenes van en la carpeta img/ (ver LEEME.txt). Si falta una, se muestra un cuadro con el nombre del archivo. */
window.INV = {
  /* Juego A: Memoria de pares (cada par = una imagen + una carta con su nombre) */
  memoria: [
    { k: 'drew',    img: 'img/drew-retrato.jpg',         name: 'Charles Drew',    sub: 'Bancos de sangre' },
    { k: 'brown',   img: 'img/brown-retrato.jpg',        name: 'Marie Brown',     sub: 'Seguridad del hogar' },
    { k: 'patente', img: 'img/brown-patente.png',        name: 'US3482037A',      sub: 'Patente de 1969' },
    { k: 'banco',   img: 'img/drew-banco-de-sangre.jpg', name: 'Banco de sangre', sub: 'Plasma listo para viajar' },
    { k: 'video',   img: 'img/brown-videoportero.jpg',   name: 'Videoportero',    sub: 'Heredero de su idea' }
  ],
  /* Juego B: Rompecabezas (usa estas imágenes; "fact" se muestra al terminar) */
  puzzle: [
    { img: 'img/drew-retrato.jpg',         name: 'Charles Richard Drew',   fact: 'Separó el plasma de la sangre y organizó Blood for Britain.' },
    { img: 'img/brown-retrato.jpg',        name: 'Marie Van Brittan Brown', fact: 'Patentó en 1969 el primer sistema de seguridad con cámara para el hogar.' },
    { img: 'img/brown-patente.png',        name: 'Patente US3482037A',     fact: 'Cámara móvil, monitor, micrófono, cerradura remota y alarma, en 1966.' },
    { img: 'img/drew-banco-de-sangre.jpg', name: 'Banco de sangre',        fact: 'Guardar y mover sangre y plasma salvó vidas en la guerra y en hospitales.' },
    { img: 'img/brown-videoportero.jpg',   name: 'Videoportero',           fact: 'Hoy repite la arquitectura que Marie y Albert patentaron.' }
  ],
  /* Juego C: Ordena la historia (los items van en el orden correcto) */
  orden: {
    drew: [
      { y: '1904',   t: 'Nace en Washington, D. C.' },
      { y: '1928',   t: 'Ingresa a McGill, en Montreal' },
      { y: '1933',   t: 'Se gradúa como médico y cirujano' },
      { y: '1940',   t: 'Doctorado en Columbia con la tesis Banked Blood' },
      { y: 'Guerra', t: 'Dirige Blood for Britain en Nueva York' }
    ],
    brown: [
      { y: '1922',        t: 'Nace en Jamaica, Queens' },
      { y: '1 ago 1966',  t: 'Solicitan la patente del sistema' },
      { y: '2 dic 1969',  t: 'Se concede la patente US3482037A' },
      { y: '6 dic 1969',  t: 'The New York Times cuenta la historia' },
      { y: '1999',        t: 'Fallece en Queens' }
    ]
  }
};