(function(){
'use strict';

const OWNER_KEY='liga2627_owner';

const css=document.createElement('style');
css.textContent=`
/* v1.5.5: check más visible */
.sticker.owned .thumb::after,
.sticker.duplicate .thumb::after{
  width:28px!important;
  height:28px!important;
  right:-7px!important;
  top:-7px!important;
  font-size:18px!important;
  border:3px solid #fff!important;
  background:#12b76a!important;
  box-shadow:0 3px 8px rgba(0,0,0,.34)!important;
}
/* Logo principal */
.ball{
  overflow:hidden!important;
  padding:0!important;
  background:#0b315e!important;
}
.ball img{
  width:100%!important;
  height:100%!important;
  object-fit:cover!important;
  display:block!important;
}
.v155OwnerBtn{
  width:100%;
  min-height:46px;
  border-radius:12px;
  border:1px solid var(--line);
  background:var(--card);
  color:var(--ink);
  font-weight:800;
  margin:0;
}
.v155FirstRun{
  position:fixed; inset:0; z-index:9999;
  background:rgba(15,23,42,.62);
  display:grid; place-items:center;
  padding:22px;
}
.v155FirstRun.hidden{display:none}
.v155FirstRunCard{
  width:min(92vw,420px);
  background:var(--card);
  color:var(--ink);
  border-radius:22px;
  padding:22px;
  box-shadow:0 22px 70px rgba(0,0,0,.28);
}
.v155FirstRunCard h2{margin:0 0 8px}
.v155FirstRunCard p{margin:0 0 15px;color:var(--muted);line-height:1.4}
.v155FirstRunCard input{
  width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;
  padding:0 13px;font-size:16px;background:var(--card);color:var(--ink);
}
.v155FirstRunCard button{
  width:100%;min-height:48px;margin-top:12px;border:0;border-radius:12px;
  background:var(--green);color:#fff;font-weight:900;font-size:15px;
}
`;
document.head.appendChild(css);

function owner(){
  return (localStorage.getItem(OWNER_KEY)||'').trim();
}
function safeOwner(){
  return (owner()||'Coleccion').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,40)||'Coleccion';
}
function setOwner(v){
  v=String(v||'').trim().replace(/\s+/g,' ').slice(0,40);
  if(v)localStorage.setItem(OWNER_KEY,v);
  return v;
}
function askOwner(force){
  if(!force && owner())return;
  let overlay=document.getElementById('v155FirstRun');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='v155FirstRun';
    overlay.className='v155FirstRun';
    overlay.innerHTML='<div class="v155FirstRunCard"><h2>Tu nombre o apodo</h2><p>Se usará para identificar tus listas de faltantes, repetidos y copias de seguridad cuando las compartas.</p><input id="v155OwnerInput" maxlength="40" autocomplete="name" placeholder="Ej. Diego"><button id="v155OwnerSave">Guardar y continuar</button></div>';
    document.body.appendChild(overlay);
    document.getElementById('v155OwnerSave').onclick=()=>{
      const v=setOwner(document.getElementById('v155OwnerInput').value);
      if(!v){toast('Escribe un nombre o apodo');return;}
      overlay.classList.add('hidden');
      toast('Colección de '+v);
    };
    document.getElementById('v155OwnerInput').addEventListener('keydown',e=>{
      if(e.key==='Enter')document.getElementById('v155OwnerSave').click();
    });
  }else{
    overlay.classList.remove('hidden');
  }
  const input=document.getElementById('v155OwnerInput');
  input.value=owner();
  setTimeout(()=>input.focus(),150);
}

function dateStamp(){return new Date().toISOString().slice(0,10);}
function shareFile(name,text,mime){
  if(window.Android&&Android.shareFile){Android.shareFile(name,text,mime||'text/plain');return;}
  if(window.Android&&Android.share){Android.share(text);return;}
  if(navigator.share){navigator.share({text});return;}
  toast('No se puede compartir en este dispositivo');
}
function namedList(mode){
  const title=mode==='missing'?'FALTANTES':'REPETIDOS';
  return 'CROMOS LIGA 2026-27\nPROPIETARIO: '+(owner()||'Sin nombre')+'\nTIPO: '+title+'\nFECHA: '+dateStamp()+'\n\n'+listText(mode);
}
function namedBackup(){
  let obj;
  try{obj=JSON.parse(backupText());}catch(e){obj={app:'Cromos Liga 2026-27',quantities:qty};}
  obj.owner=owner()||'';
  obj.version=4;
  obj.date=new Date().toISOString();
  return JSON.stringify(obj);
}

/* Compartir con propietario en nombre y contenido */
const sm=document.getElementById('shareMissing');
if(sm)sm.onclick=()=>shareFile('Faltantes_'+safeOwner()+'_'+dateStamp()+'.txt',namedList('missing'),'text/plain');
const sd=document.getElementById('shareDups');
if(sd)sd.onclick=()=>shareFile('Repetidos_'+safeOwner()+'_'+dateStamp()+'.txt',namedList('dups'),'text/plain');
const cm=document.getElementById('exportMissingCsv');
if(cm)cm.onclick=()=>shareFile('Faltantes_'+safeOwner()+'_'+dateStamp()+'.csv',csvText('missing'),'text/csv');
const cd=document.getElementById('exportDupsCsv');
if(cd)cd.onclick=()=>shareFile('Repetidos_'+safeOwner()+'_'+dateStamp()+'.csv',csvText('dups'),'text/csv');
const sb=document.getElementById('shareBackup');
if(sb)sb.onclick=()=>shareFile('Backup_'+safeOwner()+'_'+dateStamp()+'.json',namedBackup(),'application/json');

/* Logo de la aplicación en cabecera */
const ball=document.querySelector('.ball');
if(ball){
  ball.innerHTML='<img src="app_logo.png" alt="Logo Cromos Liga">';
}

/* Cambiar nombre/apodo desde opciones */
const reset=document.getElementById('resetAll');
if(reset&&!document.getElementById('changeOwner')){
  const b=document.createElement('button');
  b.id='changeOwner';
  b.className='v155OwnerBtn';
  b.textContent='Cambiar nombre / apodo';
  reset.parentNode.insertBefore(b,reset);
  b.onclick=()=>{const menu=document.getElementById('menu');if(menu)menu.classList.add('hidden');askOwner(true);};
}

/* Importar backup seleccionando archivo */
const importBtn=document.getElementById('importBackup');
if(importBtn){
  importBtn.onclick=()=>{
    const menu=document.getElementById('menu'); if(menu)menu.classList.add('hidden');
    if(window.Android&&Android.pickBackupFile){Android.pickBackupFile();}
    else{
      const modal=document.getElementById('backupModal'); if(modal)modal.classList.remove('hidden');
      toast('Selecciona o pega una copia de seguridad');
    }
  };
}
window.onImportedBackup=function(text,name){
  try{
    const obj=JSON.parse(text||'');
    if(!obj||typeof obj.quantities!=='object'||Array.isArray(obj.quantities))throw new Error('Formato no válido');
    const valid={}; let entries=0,copies=0;
    for(const [k,v] of Object.entries(obj.quantities)){
      const n=Math.max(0,parseInt(v,10)||0);
      if(n>0&&stickers.some(s=>s.id===k)){valid[k]=n;entries++;copies+=n;}
    }
    if(!confirm('Se ha encontrado una copia válida'+(name?' ('+name+')':'')+'.\n\nSe restaurarán '+entries+' cromos distintos ('+copies+' copias).\n\n¿Quieres continuar?'))return;
    qty=valid; saveQty(); renderStats(); renderTeamGrid(); renderList();
    toast('Copia de seguridad restaurada');
  }catch(e){
    toast('El archivo no es una copia válida');
  }
};

/* Puesta a cero: doble verificación */
if(reset){
  reset.onclick=()=>{
    const menu=document.getElementById('menu');if(menu)menu.classList.add('hidden');
    if(!confirm('ADVERTENCIA\n\nSe eliminarán todas las cantidades de tu colección. Este proceso NO se puede deshacer.\n\n¿Quieres continuar?'))return;
    const verify=prompt('Segunda verificación.\n\nEscribe BORRAR para poner toda la colección a cero:','');
    if(verify!=='BORRAR'){toast('Borrado cancelado');return;}
    qty={};saveQty();renderStats();renderTeamGrid();renderList();
    toast('Colección puesta a cero');
  };
}

/* Mostrar nombre actual en el menú */
const sheet=document.querySelector('#menu .sheet');
if(sheet&&!document.getElementById('ownerInfo')){
  const p=document.createElement('p');p.id='ownerInfo';p.style.cssText='margin:0 0 10px;color:var(--muted);font-size:13px';
  p.textContent='Colección de: '+(owner()||'sin nombre');
  const title=sheet.querySelector('h2'); if(title)title.insertAdjacentElement('afterend',p);
}
function refreshOwnerInfo(){
  const p=document.getElementById('ownerInfo');if(p)p.textContent='Colección de: '+(owner()||'sin nombre');
}
window.addEventListener('storage',refreshOwnerInfo);
document.addEventListener('click',e=>{if(e.target&&e.target.id==='v155OwnerSave')setTimeout(refreshOwnerInfo,0);});

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.5 · perfil, intercambio identificado, backup por archivo y borrado seguro.';

setTimeout(()=>askOwner(false),250);
})();