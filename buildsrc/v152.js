(function(){
'use strict';

const V152_FILES = {
  'Deportivo Alavés':'alaves.png',
  'Athletic Club':'athletic.png',
  'Atlético de Madrid':'atlmadrid.png',
  'FC Barcelona':'barcelona.png',
  'Real Betis':'betis.png',
  'RC Celta':'celta.png',
  'Deportivo La Coruña':'deportivocoruna.png',
  'Elche CF':'elche.png',
  'RCD Espanyol':'espanyol.png',
  'Getafe CF':'getafe.png',
  'Levante UD':'levante.png',
  'Real Madrid CF':'realmadrid.png',
  'Málaga CF':'malaga.png',
  'C.A. Osasuna':'osasuna.png',
  'Racing de Santander':'racingsantander.png',
  'Rayo Vallecano':'rayovallecano.png',
  'Real Sociedad':'realsociedad.png',
  'Sevilla FC':'sevilla.png',
  'Valencia CF':'valencia.png',
  'Villarreal CF':'villarreal.png'
};

const css=document.createElement('style');
css.textContent=`
.v152crest{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto}
.v152crest img,.v152avatar{display:block;max-width:46px;max-height:46px;object-fit:contain}
.v152avatar{width:48px;height:48px;padding:2px;box-sizing:border-box;border-radius:12px;background:rgba(255,255,255,.94)}
.v152FileBtn{width:100%;margin:0 0 10px;min-height:46px;border-radius:12px;border:1px solid var(--line);font-weight:800;background:var(--card)}
`;
document.head.appendChild(css);

function logoImg(section,avatar){
  const file=V152_FILES[section];
  if(!file) return '';
  const src='escudos/'+file;
  if(avatar) return '<img class="v152avatar" alt="Escudo '+esc(section)+'" src="'+src+'">';
  return '<div class="v152crest"><img alt="Escudo '+esc(section)+'" src="'+src+'"></div>';
}

const oldCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){return V152_FILES[section]?logoImg(section,false):(oldCrest?oldCrest(m,section):'');};
const oldAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){return s&&s.name==='Escudo'&&V152_FILES[s.section]?logoImg(s.section,true):(oldAvatar?oldAvatar(s,m):'');};

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
if(hint)hint.textContent='v1.5.2 · escudos PNG individuales, icono nuevo y listas compartidas como archivos importables.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();