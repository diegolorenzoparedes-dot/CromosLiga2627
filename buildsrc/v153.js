(function(){
'use strict';

const V153_INDEX={
  'Deportivo Alavés':0,'Athletic Club':1,'Atlético de Madrid':2,'FC Barcelona':3,'Real Betis':4,
  'RC Celta':5,'Deportivo La Coruña':6,'Elche CF':7,'RCD Espanyol':8,'Getafe CF':9,
  'Levante UD':10,'Málaga CF':11,'C.A. Osasuna':12,'Racing de Santander':13,'Rayo Vallecano':14,
  'Real Madrid CF':15,'Real Sociedad':16,'Sevilla FC':17,'Valencia CF':18,'Villarreal CF':19
};

const css=document.createElement('style');
css.textContent=`
.teamCardTop{display:grid!important;grid-template-columns:54px minmax(0,1fr)!important;align-items:center!important;column-gap:10px!important;padding:10px 11px!important;min-height:82px!important}
.teamMiniCrest{width:48px!important;height:48px!important;display:grid!important;place-items:center!important;overflow:visible!important;flex:none!important}
.teamName{font-size:12.5px!important;line-height:1.12!important;font-weight:900!important;white-space:normal!important;overflow:hidden!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;word-break:normal!important}
.teamProgressText{font-size:10px!important;line-height:1.2!important;margin-top:4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.teamBar{margin-top:6px!important}
.teamCardActions button{min-height:42px!important;font-size:11px!important}
.v153crest,.v153avatar{display:inline-block;width:48px;height:48px;flex:0 0 48px;background-repeat:no-repeat;background-size:240px 192px;background-color:rgba(255,255,255,.96);border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.thumb .v153avatar{border-radius:50%;box-shadow:none}
@media(max-width:380px){
 .teamCardTop{grid-template-columns:50px minmax(0,1fr)!important;column-gap:8px!important;padding:9px!important}
 .teamName{font-size:11.5px!important}
 .teamProgressText{font-size:9.5px!important}
}
`;
document.head.appendChild(css);

function v153Logo(section,avatar){
  const idx=V153_INDEX[section];
  if(idx===undefined||!window.V153_SPRITE)return '';
  const col=idx%5,row=Math.floor(idx/5);
  const x=-(col*48),y=-(row*48);
  const cls=avatar?'v153avatar':'v153crest';
  return '<span class="'+cls+'" role="img" aria-label="Escudo '+esc(section)+'" style="background-image:url('+window.V153_SPRITE+');background-position:'+x+'px '+y+'px"></span>';
}
const prevCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){return V153_INDEX[section]!==undefined?v153Logo(section,false):(prevCrest?prevCrest(m,section):'');};
const prevAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){return s&&s.name==='Escudo'&&V153_INDEX[s.section]!==undefined?v153Logo(s.section,true):(prevAvatar?prevAvatar(s,m):'');};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.3 · tarjetas corregidas, escudos más nítidos e icono adaptativo.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();