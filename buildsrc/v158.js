(function(){
'use strict';

const FORMAT='cromosliga2627';
const MIME='application/vnd.cromosliga';
const OWNER_KEY='liga2627_owner';
const V158_INDEX={
  'Deportivo Alavés':0,'Athletic Club':1,'Atlético de Madrid':2,'FC Barcelona':3,'Real Betis':4,
  'RC Celta':5,'Deportivo La Coruña':6,'Elche CF':7,'RCD Espanyol':8,'Getafe CF':9,
  'Levante UD':10,'Málaga CF':11,'C.A. Osasuna':12,'Racing de Santander':13,'Rayo Vallecano':14,
  'Real Madrid CF':15,'Real Sociedad':16,'Sevilla FC':17,'Valencia CF':18,'Villarreal CF':19
};

const css=document.createElement('style');
css.textContent=`
.v158crest,.v158avatar{
  display:inline-block;width:48px;height:48px;flex:0 0 48px;
  background-repeat:no-repeat;background-size:240px 192px;
  background-color:transparent;border-radius:12px;
}
.thumb .v158avatar{border-radius:50%}
`;
document.head.appendChild(css);

function crest158(section,avatar){
  const idx=V158_INDEX[section];
  if(idx===undefined)return '';
  const col=idx%5,row=Math.floor(idx/5);
  const cls=avatar?'v158avatar':'v158crest';
  return '<span class="'+cls+'" role="img" aria-label="Escudo '+esc(section)+'" '+
    'style="background-image:url(sprite_v158.png);background-position:-'+(col*48)+'px -'+(row*48)+'px"></span>';
}

const previousCrest=typeof crestMarkup==='function'?crestMarkup:null;
crestMarkup=function(m,section){
  return V158_INDEX[section]!==undefined?crest158(section,false):(previousCrest?previousCrest(m,section):'');
};
const previousAvatar=typeof avatarMarkup==='function'?avatarMarkup:null;
avatarMarkup=function(s,m){
  return s&&s.name==='Escudo'&&V158_INDEX[s.section]!==undefined?crest158(s.section,true):(previousAvatar?previousAvatar(s,m):'');
};

function owner(){return (localStorage.getItem(OWNER_KEY)||'').trim();}
function cleanName(v){
  return String(v||'Coleccion').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,40)||'Coleccion';
}
function stamp(){return new Date().toISOString().slice(0,10);}
function nativeShare(filename,obj){
  const text=typeof obj==='string'?obj:JSON.stringify(obj);
  if(window.Android&&Android.shareFile){Android.shareFile(filename,text,MIME);return;}
  if(window.Android&&Android.share){Android.share(text);return;}
  if(navigator.share){navigator.share({text});return;}
  toast('No se puede compartir en este dispositivo');
}
function idsFor(type){
  if(type==='missing')return stickers.filter(s=>getQty(s.id)===0).map(s=>s.id);
  return stickers.filter(s=>getQty(s.id)>=2).map(s=>s.id);
}
function listPackage(type){
  const items=idsFor(type);
  const quantities={};
  items.forEach(id=>{quantities[id]=getQty(id);});
  return {
    format:FORMAT,version:1,type:type==='dups'?'duplicates':'missing',
    owner:owner(),date:new Date().toISOString(),items,quantities
  };
}
function backupPackage(){
  return {
    format:FORMAT,version:1,type:'backup',owner:owner(),
    date:new Date().toISOString(),quantities:qty
  };
}
function sharePackage(type){
  const label=type==='missing'?'Faltantes':'Repetidos';
  nativeShare(label+'_'+cleanName(owner())+'_'+stamp()+'.cromosliga',listPackage(type));
}

const sm=document.getElementById('shareMissing');
if(sm)sm.onclick=()=>sharePackage('missing');
const sd=document.getElementById('shareDups');
if(sd)sd.onclick=()=>sharePackage('dups');
const sb=document.getElementById('shareBackup');
if(sb)sb.onclick=()=>nativeShare('Backup_'+cleanName(owner())+'_'+stamp()+'.cromosliga',backupPackage());

window.shareFileText=function(name,text,mime){
  if(String(name||'').toLowerCase().includes('intercambio')){
    nativeShare('Intercambio_'+cleanName(owner())+'_'+stamp()+'.cromosliga',{
      format:FORMAT,version:1,type:'exchange',owner:owner(),
      date:new Date().toISOString(),text:String(text||'')
    });
    return;
  }
  if(window.Android&&Android.shareFile){Android.shareFile(name,text,mime||'text/plain');return;}
  if(window.Android&&Android.share){Android.share(text);return;}
  if(navigator.share)navigator.share({text});
};

function openCompare(items,mode,name){
  const modal=document.getElementById('compareModal');
  const menu=document.getElementById('menu');
  const box=document.getElementById('compareText');
  const sel=document.getElementById('compareMode');
  if(menu)menu.classList.add('hidden');
  if(modal)modal.classList.remove('hidden');
  if(box)box.value=(items||[]).join('\n');
  if(sel)sel.value=mode;
  toast('Lista abierta'+(name?' · '+name:''));
  const run=document.getElementById('runCompare');
  if(run)run.click();
}
function parsePackage(text){
  try{
    const obj=JSON.parse(text||'');
    return obj&&obj.format===FORMAT?obj:null;
  }catch(e){return null;}
}

window.onCromosLigaFile=function(text,name){
  const obj=parsePackage(text);
  if(!obj){
    if(/^\s*\{/.test(text||'')&&typeof window.onImportedBackup==='function'){
      try{
        const raw=JSON.parse(text);
        if(raw&&raw.quantities){window.onImportedBackup(text,name);return;}
      }catch(e){}
    }
    if(typeof window.onImportedListLegacy==='function')window.onImportedListLegacy(text,name);
    else toast('El archivo no tiene un formato compatible');
    return;
  }

  if(obj.type==='duplicates'){
    openCompare(Array.isArray(obj.items)?obj.items:[], 'dups', name||((obj.owner||'')+' · repetidos'));
    return;
  }
  if(obj.type==='missing'){
    openCompare(Array.isArray(obj.items)?obj.items:[], 'missing', name||((obj.owner||'')+' · faltantes'));
    return;
  }
  if(obj.type==='backup'){
    if(typeof window.onImportedBackup==='function'){
      window.onImportedBackup(JSON.stringify({quantities:obj.quantities||{},owner:obj.owner||''}),name||'Backup .cromosliga');
    }
    return;
  }
  if(obj.type==='exchange'){
    const modal=document.getElementById('compareModal');
    const menu=document.getElementById('menu');
    const box=document.getElementById('compareText');
    if(menu)menu.classList.add('hidden');
    if(modal)modal.classList.remove('hidden');
    if(box)box.value=obj.text||'';
    toast('Propuesta de intercambio abierta');
    return;
  }
  toast('Tipo de archivo .cromosliga no reconocido');
};

const priorImportedList=window.onImportedList;
window.onImportedListLegacy=priorImportedList;
window.onImportedList=function(text,name){
  if(parsePackage(text)){window.onCromosLigaFile(text,name);return;}
  if(priorImportedList)priorImportedList(text,name);
};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.8 · archivos .cromosliga y nuevos escudos libres de derechos.';

if(typeof renderTeamGrid==='function')renderTeamGrid();
if(typeof renderList==='function')renderList();
})();