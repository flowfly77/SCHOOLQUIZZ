// js/profiles.js
import { db } from './firebase.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let profiles = null;
let currentUid = null;

const DEFAULT_PLAYER = (name, icon)=>({name, icon, class_code:'6e', totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[], journal:[]});

export async function load(uid){
  currentUid = uid;
  const ref = doc(db, 'users', uid, 'data', 'profiles');
  const snap = await getDoc(ref);
  if(!snap.exists()){
    profiles = {
      selected: null,
      players: {
        player1: DEFAULT_PLAYER('Joueur 1','🏀'),
        player2: DEFAULT_PLAYER('Joueur 2','❤️'),
        player3: DEFAULT_PLAYER('Joueur 3','🎮'),
        player4: DEFAULT_PLAYER('Joueur 4','💃')
      }
    };
    await setDoc(ref, profiles);
  }else{
    profiles = snap.data();
    // backfill champs manquants
    for(const id of ['player1','player2','player3','player4']){
      const p = profiles.players[id];
      if(!p.class_code) p.class_code='6e';
      if(!p.journal) p.journal=[];
      if(!p.badges) p.badges=[];
      if(!p.bestByQuiz) p.bestByQuiz={};
      if(p.totalPlayed==null) p.totalPlayed=0;
      if(p.totalCorrect==null) p.totalCorrect=0;
    }
  }
  render();
}

async function save(partial){
  const ref = doc(db, 'users', currentUid, 'data', 'profiles');
  await setDoc(ref, partial, { merge: true });
}

function bestPercent(p){
  const vals = Object.values(p.bestByQuiz||{});
  return vals.length? Math.max(...vals):0;
}

const BADGE_EMOJI = {
  first_quiz:'🌟',
  perfect:'🥇',
  ten_quizzes:'🔟',
  cent_bonnes:'🧠'
};

function renderBadges(id, p){
  const holder = document.getElementById('badges-'+id);
  if(!holder) return;
  holder.innerHTML = '';
  (p.badges||[]).forEach(b=>{
    const span = document.createElement('span');
    span.className='badge';
    span.title = b.label;
    span.textContent = BADGE_EMOJI[b.code] || '🏅';
    holder.appendChild(span);
  });
}

export function render(){
  if(!profiles) return;
  ['player1','player2','player3','player4'].forEach(id=>{
    const p = profiles.players[id];
    const best = bestPercent(p);
    const st = document.getElementById('stats-'+id);
    if(st) st.textContent = `${p.totalPlayed} quiz • ${best}% meilleur`;

    document.querySelectorAll(`.profile-card[data-id="${id}"] .name-editable span`)
      .forEach(n=>n.textContent=p.name);

    // class select
    const card = document.querySelector(`.profile-card[data-id="${id}"]`);
    if(card){
      const sel = card.querySelector('select');
      if(sel) sel.value = p.class_code || '6e';
      if(profiles.selected===id) card.classList.add('active'); else card.classList.remove('active');
    }

    renderBadges(id, p);
  });
}

export async function selectProfile(id){
  if(!profiles) return;
  profiles.selected = id;
  await save({ selected:id });
  render();
}

export async function selectAndEnter(id){
  await selectProfile(id);
  if (window && window.UI && window.UI.goToApp) window.UI.goToApp();
}

export async function renameProfile(e, id){
  e.stopPropagation();
  if(!profiles) return;
  const cur = profiles.players[id].name || id;
  const v = prompt('Nouveau nom du profil :', cur);
  if(v && v.trim()){
    profiles.players[id].name = v.trim();
    await save({ players: profiles.players });
    render();
  }
}

export async function changeClass(e, id){
  e.stopPropagation();
  if(!profiles) return;
  const v = e.target.value || '6e';
  profiles.players[id].class_code = v;
  await save({ players: profiles.players });
  render();
}

export async function resetCurrentProfile(){
  if(!profiles) return;
  const id = profiles.selected || 'player1';
  if(!confirm('Réinitialiser toutes les stats de '+profiles.players[id].name+' ?')) return;
  const keep = profiles.players[id];
  profiles.players[id] = DEFAULT_PLAYER(keep.name, keep.icon);
  await save({ players: profiles.players });
  render();
}

/** Appelée par V3 (postMessage) */
export async function updateFromQuiz({ key, correct, total, title }){
  if(!profiles || !profiles.selected) return;
  const pid = profiles.selected;
  const p = profiles.players[pid];

  const c = Number(correct)||0;
  const t = Math.max(1, Number(total)||1);
  const percent = Math.round((c/t)*100);

  p.totalPlayed = (p.totalPlayed||0) + 1;
  p.totalCorrect = (p.totalCorrect||0) + c;
  if(!p.bestByQuiz) p.bestByQuiz = {};
  if(percent > (p.bestByQuiz[key]||0)) p.bestByQuiz[key] = percent;

  // badges
  if(!p.badges) p.badges = [];
  const give = (code, label)=>{ if(!p.badges.find(b=>b.code===code)) p.badges.push({code,label,ts:Date.now()}); };
  if(p.totalPlayed === 1) give('first_quiz','Premier quiz !');
  if(percent === 100) give('perfect','Score parfait (100%)');
  if(p.totalPlayed === 10) give('ten_quizzes','10 quiz joués');
  if((p.totalCorrect||0) >= 100) give('cent_bonnes','100 bonnes réponses');

  // journal (limite 20)
  if(!p.journal) p.journal=[];
  p.journal.unshift({ ts: Date.now(), key, title: title||'', score:c, total:t, pct:percent });
  if(p.journal.length>20) p.journal = p.journal.slice(0,20);

  await save({ players: profiles.players });
  render();
}

window.PROFILES = { selectProfile, selectAndEnter, renameProfile, changeClass, resetCurrentProfile, updateFromQuiz };
