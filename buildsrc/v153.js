(function(){
'use strict';

const V153_FILES={
  'Deportivo Alavés':'alaves','Athletic Club':'athletic','Atlético de Madrid':'atlmadrid','FC Barcelona':'barcelona','Real Betis':'betis',
  'RC Celta':'celta','Deportivo La Coruña':'deportivocoruna','Elche CF':'elche','RCD Espanyol':'espanyol','Getafe CF':'getafe',
  'Levante UD':'levante','Málaga CF':'malaga','C.A. Osasuna':'osasuna','Racing de Santander':'racingsantander','Rayo Vallecano':'rayovallecano',
  'Real Madrid CF':'realmadrid','Real Sociedad':'realsociedad','Sevilla FC':'sevilla','Valencia CF':'valencia','Villarreal CF':'villarreal'
};

const css=document.createElement('style');
css.textContent=`
.teamCardTop{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;align-items:center!important;column-gap:10px!important;padding:10px!important;min-height:78px!important}
.teamMiniCrest{width:48px!important;height:48px!important;display:grid!important;place-items:center!important;overflow:visible!important;flex:none!important}
.teamName{font-size:12.5px!important;line-height:1.12!important;font-weight:900!important;white-space:normal!important;overflow:hidden!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;word-break:normal!important}
.teamProgressText{font-size:10px!important;line-height:1.2!important;margin-top:3px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.teamBar{margin-top:6px!important}
.teamCardActions button{min-height:42px!important;font-size:11px!important}
.v153crest,.v153avatar{display:grid;place-items:center;overflow:hidden;background:rgba(255,255,255,.96);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.v153crest{width:48px;height:48px;border-radius:12px}
.v153avatar{width:48px;height:48px;border-radius:12px}
.v153crest img,.v153avatar img{width:100%;height:100%;object-fit:contain;display:block}
.sectionHeader .v153crest{width:44px;height:44px;border-radius:11px;flex:0 0 44px}
.thumb .v153avatar{width:48px;height:48px;border-radius:50%;box-shadow:none;background:#fff}
@media(max-width:380px){.teamCardTop{grid-template-columns:44px minmax(0,1fr)!important;column-gap:8px!important}.teamMiniCrest,.v153crest{width:44px!important;height:44px!important}.teamName{font-size:11.5px!important}.teamProgressText{font-size:9.5px!important}}
`;
document.head.appendChild(css);

function v153Logo(section,avatar){
  const key=V153_FILES[section];
  const src=key&&window.V153_LOGO_DATA&&window.V153_LOGO_DATA[key];
  if(!src)return '';
  const cls=avatar?'v153avatar':'v153crest';
  return '<span class="'+cls+'" role="img" aria-label="Escudo '+esc(section)+'"><img alt="" src="'+src+'"></span>';
}
const prevCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){return V153_FILES[section]?v153Logo(section,false):(prevCrest?prevCrest(m,section):'');};
const prevAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){return s&&s.name==='Escudo'&&V153_FILES[s.section]?v153Logo(s.section,true):(prevAvatar?prevAvatar(s,m):'');};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.3 · tarjetas corregidas, escudos HD e icono adaptativo.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();