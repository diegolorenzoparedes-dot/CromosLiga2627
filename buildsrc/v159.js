(function(){
'use strict';

const V159_INDEX={
  'Deportivo Alavés':0,'Athletic Club':1,'Atlético de Madrid':2,'FC Barcelona':3,'Real Betis':4,
  'RC Celta':5,'Deportivo La Coruña':6,'Elche CF':7,'RCD Espanyol':8,'Getafe CF':9,
  'Levante UD':10,'Málaga CF':11,'C.A. Osasuna':12,'Racing de Santander':13,'Rayo Vallecano':14,
  'Real Madrid CF':15,'Real Sociedad':16,'Sevilla FC':17,'Valencia CF':18,'Villarreal CF':19
};

const css=document.createElement('style');
css.textContent=`
.v159crest,.v159avatar{
  display:inline-block;
  width:48px;height:48px;flex:0 0 48px;
  background-repeat:no-repeat;
  background-size:240px 192px;
  background-color:transparent;
  border-radius:12px;
}
.thumb .v159avatar{border-radius:50%}
`;
document.head.appendChild(css);

function v159Logo(section,avatar){
  const idx=V159_INDEX[section];
  if(idx===undefined || !window.V159_SPRITE)return '';
  const col=idx%5,row=Math.floor(idx/5);
  const cls=avatar?'v159avatar':'v159crest';
  return '<span class="'+cls+'" role="img" aria-label="Escudo '+esc(section)+'" '+
    'style="background-image:url('+window.V159_SPRITE+');background-position:-'+(col*48)+'px -'+(row*48)+'px"></span>';
}

const prevCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){
  return V159_INDEX[section]!==undefined?v159Logo(section,false):(prevCrest?prevCrest(m,section):'');
};

const prevAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){
  return s&&s.name==='Escudo'&&V159_INDEX[s.section]!==undefined
    ?v159Logo(s.section,true)
    :(prevAvatar?prevAvatar(s,m):'');
};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.9 · escudos embebidos y apertura .cromosliga compatible con WhatsApp.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();