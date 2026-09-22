(function(){
  'use strict';

  const logoIndex = {
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
    'Real Madrid CF':11,
    'Málaga CF':12,
    'C.A. Osasuna':13,
    'Racing de Santander':14,
    'Rayo Vallecano':15,
    'Real Sociedad':16,
    'Sevilla FC':17,
    'Valencia CF':18,
    'Villarreal CF':19
  };

  const style = document.createElement('style');
  style.textContent = `
    .realCrest{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto}
    .realCrest .teamLogo44{width:44px;height:44px;display:block;background-image:url('logos_sprite.webp');background-size:220px 176px;background-repeat:no-repeat;background-color:rgba(255,255,255,.9);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.17)}
    .thumb .teamLogo48{width:48px;height:48px;display:block;background-image:url('logos_sprite.webp');background-size:240px 192px;background-repeat:no-repeat;background-color:rgba(255,255,255,.94);border-radius:50%;box-shadow:inset 0 0 0 1px rgba(16,24,40,.08)}
    .compareIntro{font-size:13px;line-height:1.45;color:var(--muted);margin:-4px 0 12px}
    .compareMode{width:100%;margin-bottom:10px}
    .compareBox{width:100%;min-height:150px;resize:vertical}
    .compareResult{margin-top:14px}
    .compareSummary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}
    .compareStat{border:1px solid var(--line);border-radius:13px;padding:10px;background:var(--card)}
    .compareStat b{display:block;font-size:22px}.compareStat span{font-size:11px;color:var(--muted)}
    .compareGroup{border:1px solid var(--line);border-radius:13px;margin-top:9px;overflow:hidden;background:var(--card)}
    .compareGroup h3{font-size:13px;margin:0;padding:10px 12px;background:rgba(22,101,52,.08)}
    .compareCodes{padding:10px 12px;font-size:12px;line-height:1.55;max-height:180px;overflow:auto;white-space:pre-wrap}
    .compareActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
    .compareActions button{min-height:46px;border-radius:12px;border:1px solid var(--line);font-weight:800}
    .compareActions .primary{border:0}
    .compareHint{font-size:11px;color:var(--muted);margin-top:7px}
  `;
  document.head.appendChild(style);

  function spriteMarkup(section,size){
    const idx = logoIndex[section];
    if(idx === undefined) return '';
    const x = idx % 5;
    const y = Math.floor(idx / 5);
    const px = size === 48 ? 48 : 44;
    return '<span class="teamLogo'+px+'" style="background-position:-'+(x*px)+'px -'+(y*px)+'px"></span>';
  }

  if(typeof crestMarkup === 'function'){
    const oldCrestMarkup = crestMarkup;
    crestMarkup = function(m,section){
      if(logoIndex[section] !== undefined){
        return '<div class="realCrest">'+spriteMarkup(section,44)+'</div>';
      }
      return oldCrestMarkup(m,section);
    };
  }

  if(typeof avatarMarkup === 'function'){
    const oldAvatarMarkup = avatarMarkup;
    avatarMarkup = function(s,m){
      if(s && s.name === 'Escudo' && logoIndex[s.section] !== undefined){
        return spriteMarkup(s.section,48);
      }
      return oldAvatarMarkup(s,m);
    };
  }

  const sheet = document.querySelector('#menu .sheet');
  if(sheet && !document.getElementById('compareShared')){
    const compareBtn = document.createElement('button');
    compareBtn.id = 'compareShared';
    compareBtn.textContent = 'Comparar lista recibida';
    const firstBackup = document.getElementById('shareBackup');
    sheet.insertBefore(compareBtn, firstBackup || document.getElementById('closeMenu'));
  }

  const modal = document.createElement('div');
  modal.id = 'compareModal';
  modal.className = 'modal hidden';
  modal.innerHTML = `
    <div class="sheet">
      <div class="grab"></div>
      <h2>Comparar lista recibida</h2>
      <p class="compareIntro">Pega la lista que te ha enviado otra persona. Puede ser una lista compartida desde esta app, una lista escrita a mano con códigos de cromos o incluso una copia completa de la colección.</p>
      <select id="compareMode" class="compareMode">
        <option value="dups">La otra persona me envía sus repetidos</option>
        <option value="missing">La otra persona me envía sus faltantes</option>
      </select>
      <textarea id="compareText" class="compareBox" placeholder="Ejemplo:\nALA 3 · Sivera\nBAR 20 · Lamine Yamal\nRMA 14 · Bellingham"></textarea>
      <div class="compareHint">La comparación no modifica tu colección.</div>
      <div id="compareResult" class="compareResult hidden"></div>
      <div class="compareActions">
        <button id="closeCompare" class="ghost">Cerrar</button>
        <button id="runCompare" class="primary">Comparar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function escapeRegex(text){
    return text.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&');
  }

  function codeRegex(id){
    let p = '';
    for(const ch of String(id).toUpperCase()){
      if(ch === ' ') p += '\\s*';
      else if(ch === '-') p += '[-\\s]*';
      else p += escapeRegex(ch);
    }
    return new RegExp('(^|[^A-Z0-9])'+p+'(?=$|[^A-Z0-9])','i');
  }

  function parseReceived(text,mode){
    const found = new Set();
    const raw = (text || '').trim();
    if(!raw) return [];

    if(raw.startsWith('{')){
      try{
        const obj = JSON.parse(raw);
        if(obj && obj.quantities && typeof obj.quantities === 'object'){
          if(mode === 'dups'){
            for(const s of stickers){
              if(Number(obj.quantities[s.id] || 0) >= 2) found.add(s.id);
            }
          }else{
            for(const s of stickers){
              if(Number(obj.quantities[s.id] || 0) <= 0) found.add(s.id);
            }
          }
          return Array.from(found);
        }
      }catch(e){}
    }

    const upper = raw.toUpperCase();
    const sorted = stickers.slice().sort((a,b)=>String(b.id).length-String(a.id).length);
    for(const s of sorted){
      if(codeRegex(s.id).test(upper)) found.add(s.id);
    }
    return Array.from(found);
  }

  function lines(ids){
    if(!ids.length) return 'Ninguno';
    const bySection = new Map();
    ids.forEach(id=>{
      const s = stickers.find(x=>x.id===id);
      if(!s) return;
      if(!bySection.has(s.section)) bySection.set(s.section,[]);
      bySection.get(s.section).push(s);
    });
    let out = '';
    for(const [sec,list] of bySection){
      out += (out ? '\n' : '') + sec + '\n';
      out += list.map(s=>s.id+' · '+s.name).join('\n') + '\n';
    }
    return out.trim();
  }

  let lastComparison = null;

  function renderComparison(){
    const text = document.getElementById('compareText').value;
    const mode = document.getElementById('compareMode').value;
    const ids = parseReceived(text,mode);
    const result = document.getElementById('compareResult');

    if(!ids.length){
      result.classList.remove('hidden');
      result.innerHTML = '<div class="compareGroup"><h3>No he encontrado códigos</h3><div class="compareCodes">Revisa que la lista incluya códigos como ALA 3, BAR 20, RMA 14, UF 5, LY-O…</div></div>';
      lastComparison = null;
      return;
    }

    if(mode === 'dups'){
      const need = ids.filter(id=>getQty(id)===0);
      const have = ids.filter(id=>getQty(id)>0);
      lastComparison = {mode,ids,need,have};
      result.innerHTML =
        '<div class="compareSummary">'+
          '<div class="compareStat"><b>'+need.length+'</b><span>me faltan y me puede dar</span></div>'+
          '<div class="compareStat"><b>'+have.length+'</b><span>ya los tengo</span></div>'+
        '</div>'+
        '<div class="compareGroup"><h3>Me interesan</h3><div class="compareCodes">'+esc(lines(need))+'</div></div>'+
        '<div class="compareGroup"><h3>Ya los tengo</h3><div class="compareCodes">'+esc(lines(have))+'</div></div>'+
        '<div class="compareActions"><button id="shareExchange" class="primary">Compartir intercambio</button><button id="filterInteresting">Ver los que me faltan</button></div>';
    } else {
      const canGive = ids.filter(id=>getQty(id)>=2);
      const bothMissing = ids.filter(id=>getQty(id)===0);
      const onlyOne = ids.filter(id=>getQty(id)===1);
      lastComparison = {mode,ids,canGive,bothMissing,onlyOne};
      result.innerHTML =
        '<div class="compareSummary">'+
          '<div class="compareStat"><b>'+canGive.length+'</b><span>puedo ofrecerle</span></div>'+
          '<div class="compareStat"><b>'+bothMissing.length+'</b><span>nos faltan a los dos</span></div>'+
        '</div>'+
        '<div class="compareGroup"><h3>Le puedo ofrecer</h3><div class="compareCodes">'+esc(lines(canGive))+'</div></div>'+
        '<div class="compareGroup"><h3>Nos faltan a los dos</h3><div class="compareCodes">'+esc(lines(bothMissing))+'</div></div>'+
        '<div class="compareGroup"><h3>Los tengo, pero no repetidos</h3><div class="compareCodes">'+esc(lines(onlyOne))+'</div></div>'+
        '<div class="compareActions"><button id="shareExchange" class="primary">Compartir intercambio</button><button id="filterInteresting">Ver mis repetidos útiles</button></div>';
    }

    result.classList.remove('hidden');

    const shareBtn = document.getElementById('shareExchange');
    if(shareBtn) shareBtn.onclick = shareComparison;
    const filterBtn = document.getElementById('filterInteresting');
    if(filterBtn) filterBtn.onclick = filterComparison;
  }

  function shareComparison(){
    if(!lastComparison) return;
    let text = 'Cromos Liga 2026-27 · PROPUESTA DE INTERCAMBIO\n';
    if(lastComparison.mode === 'dups'){
      text += '\nDe tus repetidos, a mí me faltan:\n'+lines(lastComparison.need);
    }else{
      text += '\nDe tus faltantes, yo te puedo ofrecer:\n'+lines(lastComparison.canGive);
      if(lastComparison.bothMissing.length){
        text += '\n\nNos faltan a los dos:\n'+lines(lastComparison.bothMissing);
      }
    }
    if(window.shareFileText) window.shareFileText('intercambio_cromos_2026-27.txt',text,'text/plain');
    else share(text);
  }

  function filterComparison(){
    if(!lastComparison) return;
    const ids = lastComparison.mode === 'dups' ? lastComparison.need : lastComparison.canGive;
    if(!ids.length){ toast('No hay cromos para mostrar'); return; }
    document.getElementById('compareModal').classList.add('hidden');
    document.getElementById('menu').classList.add('hidden');
    const idSet = new Set(ids);
    const originalFiltered = filtered;
    filtered = function(){
      const base = originalFiltered();
      return base.filter(s=>idSet.has(s.id));
    };
    document.getElementById('sectionFilter').value='';
    document.getElementById('typeFilter').value='';
    document.getElementById('search').value='';
    activeTab='all';
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x.dataset.tab==='all'));
    renderList();
    toast('Mostrando '+ids.length+' cromos de la comparación');
    setTimeout(()=>{
      filtered = originalFiltered;
    },0);
  }

  const compareBtn = document.getElementById('compareShared');
  if(compareBtn) compareBtn.onclick = ()=>{
    document.getElementById('menu').classList.add('hidden');
    modal.classList.remove('hidden');
    document.getElementById('compareText').focus();
  };
  document.getElementById('closeCompare').onclick = ()=>modal.classList.add('hidden');
  document.getElementById('runCompare').onclick = renderComparison;
  modal.addEventListener('click',e=>{ if(e.target===modal) modal.classList.add('hidden'); });

  const hint = document.querySelector('.quick .hint');
  if(hint) hint.textContent = 'v1.5 · escudos reales aportados por ti, icono renovado y comparación de listas para intercambios. Todo funciona sin conexión.';

  if(typeof renderTeamGrid === 'function') renderTeamGrid();
  if(typeof renderList === 'function') renderList();
})();