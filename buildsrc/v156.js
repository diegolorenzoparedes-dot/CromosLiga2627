(function(){
'use strict';

const css=document.createElement('style');
css.textContent=`
/* v1.5.6: sin check; avatar verde cuando está conseguido */
.sticker.owned .thumb::after,
.sticker.duplicate .thumb::after{
  display:none!important;
  content:none!important;
}
.sticker.owned .thumb > svg rect:first-of-type,
.sticker.duplicate .thumb > svg rect:first-of-type{
  fill:#16a34a!important;
}
.sticker.duplicate .thumb > svg rect:first-of-type{
  fill:#15803d!important;
}

/* Modal seguro de borrado */
.v156Overlay{
  position:fixed;inset:0;z-index:10000;
  background:rgba(15,23,42,.66);
  display:grid;place-items:center;padding:20px;
}
.v156Overlay.hidden{display:none}
.v156Card{
  width:min(92vw,430px);background:var(--card);color:var(--ink);
  border-radius:22px;padding:22px;box-shadow:0 22px 70px rgba(0,0,0,.3)
}
.v156Card h2{margin:0 0 8px}
.v156Card p{color:var(--muted);line-height:1.42}
.v156Warning{color:#b42318!important;font-weight:800}
.v156Card input{
  width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;
  padding:0 13px;font-size:16px;background:var(--card);color:var(--ink)
}
.v156Actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.v156Actions button{min-height:46px;border-radius:12px;font-weight:900;border:1px solid var(--line)}
.v156Cancel{background:var(--card);color:var(--ink)}
.v156Delete{background:#b42318;color:#fff;border-color:#b42318!important}
.v156Delete:disabled{opacity:.4}
`;
document.head.appendChild(css);

const reset=document.getElementById('resetAll');
if(reset){
  let overlay=document.getElementById('v156ResetOverlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='v156ResetOverlay';
    overlay.className='v156Overlay hidden';
    overlay.innerHTML='<div class="v156Card"><h2>Poner colección a cero</h2><p class="v156Warning">Esta acción eliminará todas las cantidades de tu colección y no se puede deshacer.</p><p>Para confirmar, escribe <strong>BORRAR</strong>.</p><input id="v156ResetInput" autocomplete="off" placeholder="BORRAR"><div class="v156Actions"><button id="v156ResetCancel" class="v156Cancel">Cancelar</button><button id="v156ResetConfirm" class="v156Delete" disabled>Borrar colección</button></div></div>';
    document.body.appendChild(overlay);
  }
  const input=document.getElementById('v156ResetInput');
  const cancel=document.getElementById('v156ResetCancel');
  const confirmBtn=document.getElementById('v156ResetConfirm');

  input.oninput=()=>{confirmBtn.disabled=input.value.trim()!=='BORRAR';};
  cancel.onclick=()=>{overlay.classList.add('hidden');input.value='';confirmBtn.disabled=true;};
  overlay.addEventListener('click',e=>{if(e.target===overlay)cancel.click();});
  confirmBtn.onclick=()=>{
    if(input.value.trim()!=='BORRAR')return;
    qty={};
    saveQty();
    renderStats();
    renderTeamGrid();
    renderList();
    overlay.classList.add('hidden');
    input.value='';
    confirmBtn.disabled=true;
    toast('Colección puesta a cero');
  };
  reset.onclick=()=>{
    const menu=document.getElementById('menu');if(menu)menu.classList.add('hidden');
    overlay.classList.remove('hidden');
    setTimeout(()=>input.focus(),100);
  };
}

/* Confirmación visual de restauración de backup, sin diálogos JS */
let pendingBackup=null;
function ensureBackupOverlay(){
  let o=document.getElementById('v156BackupOverlay');
  if(o)return o;
  o=document.createElement('div');
  o.id='v156BackupOverlay';
  o.className='v156Overlay hidden';
  o.innerHTML='<div class="v156Card"><h2>Restaurar copia</h2><p id="v156BackupInfo"></p><p class="v156Warning">La colección actual será sustituida por la copia seleccionada.</p><div class="v156Actions"><button id="v156BackupCancel" class="v156Cancel">Cancelar</button><button id="v156BackupConfirm" class="v156Delete">Restaurar</button></div></div>';
  document.body.appendChild(o);
  document.getElementById('v156BackupCancel').onclick=()=>{pendingBackup=null;o.classList.add('hidden');};
  document.getElementById('v156BackupConfirm').onclick=()=>{
    if(!pendingBackup)return;
    qty=pendingBackup.valid;
    saveQty();
    renderStats();renderTeamGrid();renderList();
    pendingBackup=null;o.classList.add('hidden');
    toast('Copia de seguridad restaurada');
  };
  o.addEventListener('click',e=>{if(e.target===o)document.getElementById('v156BackupCancel').click();});
  return o;
}
window.onImportedBackup=function(text,name){
  try{
    const obj=JSON.parse(text||'');
    if(!obj||typeof obj.quantities!=='object'||Array.isArray(obj.quantities))throw new Error();
    const valid={};let entries=0,copies=0;
    for(const [k,v] of Object.entries(obj.quantities)){
      const n=Math.max(0,parseInt(v,10)||0);
      if(n>0&&stickers.some(s=>s.id===k)){valid[k]=n;entries++;copies+=n;}
    }
    pendingBackup={valid};
    const o=ensureBackupOverlay();
    document.getElementById('v156BackupInfo').textContent='Archivo: '+(name||'copia de seguridad')+' · '+entries+' cromos distintos · '+copies+' copias.';
    o.classList.remove('hidden');
  }catch(e){
    toast('El archivo no es una copia válida');
  }
};

const hint=document.querySelector('.quick .hint');
if(hint)hint.textContent='v1.5.6 · avatar verde, borrado seguro reparado e icono ampliado.';

if(typeof renderList==='function')renderList();
})();