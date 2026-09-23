(function(){
'use strict';

const css=document.createElement('style');
css.textContent=`
/* v1.5.4: código de ancho fijo */
.sticker{
  grid-template-columns:48px 88px minmax(0,1fr) auto!important;
  gap:10px!important;
  align-items:center!important;
}
.code{
  width:88px!important;
  min-width:88px!important;
  max-width:88px!important;
  box-sizing:border-box!important;
  padding:3px 6px!important;
  overflow:hidden!important;
  white-space:nowrap!important;
  text-overflow:ellipsis!important;
}

/* v1.5.4: check verde cuando el cromo está conseguido */
.sticker.owned .thumb::after,
.sticker.duplicate .thumb::after{
  content:'✓';
  position:absolute;
  right:-3px;
  top:-3px;
  width:20px;
  height:20px;
  border-radius:50%;
  display:grid;
  place-items:center;
  background:#16a34a;
  color:#fff;
  font-size:13px;
  line-height:1;
  font-weight:1000;
  border:2px solid #fff;
  box-shadow:0 2px 5px rgba(0,0,0,.24);
  z-index:5;
}
@media(prefers-color-scheme:dark){
  .sticker.owned .thumb::after,
  .sticker.duplicate .thumb::after{border-color:#151f2b}
}
@media(max-width:380px){
  .sticker{
    grid-template-columns:46px 82px minmax(0,1fr) auto!important;
    gap:8px!important;
  }
  .code{
    width:82px!important;
    min-width:82px!important;
    max-width:82px!important;
    font-size:11px!important;
  }
}
`;
document.head.appendChild(css);

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.4 · icono ampliado, códigos alineados y check verde en cromos conseguidos.';

if(typeof renderList==='function')renderList();
})();