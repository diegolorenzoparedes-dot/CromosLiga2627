(function(){
'use strict';

/*
 v1.5.7
 - El icono se prepara en el workflow usando el logo completo, sin recortes destructivos.
 - Se mantiene avatar verde para cromos conseguidos.
 - Se mantiene borrado seguro mediante modal propio.
*/

const css=document.createElement('style');
css.textContent=`
/* Asegurar que no quede ningún check heredado */
.sticker.owned .thumb::after,
.sticker.duplicate .thumb::after{
  display:none!important;
  content:none!important;
}

/* Fondo verde en la silueta cuando el cromo está en colección */
.sticker.owned .thumb > svg rect:first-of-type{
  fill:#16a34a!important;
}
.sticker.duplicate .thumb > svg rect:first-of-type{
  fill:#15803d!important;
}

/* Logo de cabecera: ocupar completamente el recuadro */
.ball{
  width:50px!important;
  height:50px!important;
  padding:0!important;
  overflow:hidden!important;
  background:#0B315E!important;
  border-radius:15px!important;
}
.ball img{
  width:100%!important;
  height:100%!important;
  display:block!important;
  object-fit:cover!important;
  object-position:center!important;
  transform:none!important;
}
`;
document.head.appendChild(css);

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.7 · logo grande real, avatar verde y borrado seguro.';

if(typeof renderList==='function')renderList();
})();