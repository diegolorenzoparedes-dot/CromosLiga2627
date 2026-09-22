(function(){
'use strict';

const V151_LOGOS = {
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

const st = document.createElement('style');
st.textContent = `
  .v151LogoClip{
    position:relative;
    display:inline-block;
    overflow:hidden;
    flex:0 0 auto;
    background:#fff;
    border-radius:12px;
    box-shadow:0 2px 8px rgba(0,0,0,.16);
  }
  .v151LogoClip.round{border-radius:50%}
  .v151LogoClip img{
    position:absolute;
    left:0; top:0;
    max-width:none !important;
    object-fit:fill;
    display:block;
  }
  .teamMiniCrest .v151LogoClip{box-shadow:none;background:rgba(255,255,255,.94)}
  .sectionHeader .v151LogoClip{box-shadow:0 2px 6px rgba(0,0,0,.2)}
`;
document.head.appendChild(st);

function spriteLogo(section, size, round){
  const idx = V151_LOGOS[section];
  if(idx === undefined) return '';
  const col = idx % 5;
  const row = Math.floor(idx / 5);
  const sw = size * 5;
  const sh = size * 4;
  return '<span class="v151LogoClip'+(round?' round':'')+'" style="width:'+size+'px;height:'+size+'px">'+
    '<img alt="" src="logos_sprite.webp" width="'+sw+'" height="'+sh+'" '+
    'style="width:'+sw+'px;height:'+sh+'px;transform:translate(-'+(col*size)+'px,-'+(row*size)+'px)">'+
    '</span>';
}

const previousCrest = typeof crestMarkup === 'function' ? crestMarkup : null;
crestMarkup = function(m, section){
  if(V151_LOGOS[section] !== undefined){
    return '<div class="crestWrap" style="width:48px;height:48px">'+spriteLogo(section,44,false)+'</div>';
  }
  return previousCrest ? previousCrest(m,section) : '';
};

const previousAvatar = typeof avatarMarkup === 'function' ? avatarMarkup : null;
avatarMarkup = function(s,m){
  if(s && s.name === 'Escudo' && V151_LOGOS[s.section] !== undefined){
    return spriteLogo(s.section,48,true);
  }
  return previousAvatar ? previousAvatar(s,m) : '';
};

const hint = document.querySelector('.quick .hint');
if(hint){
  hint.textContent='v1.5.1 · escudos corregidos, icono renovado y comparación de listas para intercambios. Todo funciona sin conexión.';
}

if(typeof renderTeamGrid === 'function') renderTeamGrid();
if(typeof renderList === 'function') renderList();
})();