(function(){
'use strict';

const V152_INDEX = {
  'Deportivo Alavés':0,
  'Athletic Club':1,
  'Atlético de Madrid':2,
  'FC Barcelona':3,
  'Real Betis':4,
  'RC Celta':5,
  'Deportivo La Coruña':6,
  'Elche CF':7,
  'RCD Espanyol':8,
  'Getafe CF':9,
  'Levante UD':10,
  'Málaga CF':11,
  'C.A. Osasuna':12,
  'Racing de Santander':13,
  'Rayo Vallecano':14,
  'Real Madrid CF':15,
  'Real Sociedad':16,
  'Sevilla FC':17,
  'Valencia CF':18,
  'Villarreal CF':19
};

const css=document.createElement('style');
css.textContent=`
.v152crest,.v152avatar{display:inline-block;width:48px;height:48px;flex:0 0 auto;background-repeat:no-repeat;background-size:240px 192px;background-color:rgba(255,255,255,.94)}
.v152crest{border-radius:12px}
.v152avatar{border-radius:12px}
.v152FileBtn{width:100%;margin:0 0 10px;min-height:46px;border-radius:12px;border:1px solid var(--line);font-weight:800;background:var(--card)}
`;
document.head.appendChild(css);

function logoImg(section,avatar){
  const idx=V152_INDEX[section];
  if(idx===undefined || !window.V152_SPRITE) return '';
  const col=idx%5, row=Math.floor(idx/5);
  const x=-(col*48), y=-(row*48);
  const cls=avatar?'v152avatar':'v152crest';
  return '<span class="'+cls+'" role="img" aria-label="Escudo '+esc(section)+'" style="background-image:url('+window.V152_SPRITE+');background-position:'+x+'px '+y+'px"></span>';
}

const oldCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){return V152_INDEX[section]!==undefined?logoImg(section,false):(oldCrest?oldCrest(m,section):'');};
const oldAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){return s&&s.name==='Escudo'&&V152_INDEX[s.section]!==undefined?logoImg(s.section,true):(oldAvatar?oldAvatar(s,m):'');};

function safeDate(){return new Date().toISOString().slice(0,10);}
function asFile(name,text,mime){
  if(window.Android&&Android.shareFile){Android.shareFile(name,text,mime||'text/plain');return;}
  if(window.Android&&Android.share){Android.share(text);return;}
  if(navigator.share){navigator.share({text:text});return;}
  toast('No se puede compartir en este dispositivo');
}
window.shareFileText=asFile;

function listFile(mode){
  const isMissing=mode==='missing';
  const title=isMissing?'FALTANTES':'REPETIDOS';
  const body=(typeof listText==='function'?listText(mode):'');
  return 'CROMOS LIGA 2026-27\nTIPO: '+title+'\nFECHA: '+safeDate()+'\n\n'+body;
}

const sm=document.getElementById('shareMissing');
if(sm) sm.onclick=()=>asFile('cromos_faltantes_2026-27_'+safeDate()+'.txt',listFile('missing'),'text/plain');
const sd=document.getElementById('shareDups');
if(sd) sd.onclick=()=>asFile('cromos_repetidos_2026-27_'+safeDate()+'.txt',listFile('dups'),'text/plain');
const cm=document.getElementById('exportMissingCsv');
if(cm) cm.onclick=()=>asFile('cromos_faltantes_2026-27_'+safeDate()+'.csv',csvText('missing'),'text/csv');
const cd=document.getElementById('exportDupsCsv');
if(cd) cd.onclick=()=>asFile('cromos_repetidos_2026-27_'+safeDate()+'.csv',csvText('dups'),'text/csv');
const sb=document.getElementById('shareBackup');
if(sb) sb.onclick=()=>asFile('cromos_liga_backup_'+safeDate()+'.json',backupText(),'application/json');

const compareText=document.getElementById('compareText');
if(compareText&&!document.getElementById('importCompareFile')){
  const btn=document.createElement('button');
  btn.id='importCompareFile';btn.className='v152FileBtn';btn.textContent='Importar archivo recibido';
  compareText.parentNode.insertBefore(btn,compareText);
  btn.onclick=()=>{
    if(window.Android&&Android.pickFile) Android.pickFile();
    else toast('La importación de archivos requiere Android');
  };
}

window.onImportedList=function(text,name){
  const modal=document.getElementById('compareModal');
  const menu=document.getElementById('menu');
  const box=document.getElementById('compareText');
  const mode=document.getElementById('compareMode');
  if(menu)menu.classList.add('hidden');
  if(modal)modal.classList.remove('hidden');
  if(box)box.value=text||'';
  const n=(name||'').toLowerCase();
  if(mode){if(n.includes('repet'))mode.value='dups';else if(n.includes('falt'))mode.value='missing';}
  toast('Archivo importado'+(name?' · '+name:''));
  const run=document.getElementById('runCompare'); if(run)run.click();
};
window.onImportError=function(msg){toast(msg||'No se pudo leer el archivo');};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.2 · escudos embebidos, icono nuevo y listas compartidas como archivos importables.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();