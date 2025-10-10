
import { db } from './firebase.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let profiles = null;
let currentUid = null;

export async function load(uid){
  currentUid = uid;
  const ref = doc(db, 'users', uid, 'data', 'profiles');
  const snap = await getDoc(ref);
  if(!snap.exists()){
    profiles = {
      selected: null,
      players: {
        player1:{name:'Joueur 1', icon:'🏀', totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[]},
        player2:{name:'Joueur 2', icon:'❤️', totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[]},
        player3:{name:'Joueur 3', icon:'🎮', totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[]},
        player4:{name:'Joueur 4', icon:'💃', totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[]}
      }
    };
    await setDoc(ref, profiles);
  }else{
    profiles = snap.data();
  }
  render();
}

async function save(partial){
  const ref = doc(db, 'users', currentUid, 'data', 'profiles');
  await setDoc(ref, partial, { merge: true });
}

export function render(){
  if(!profiles) return;
  ['player1','player2','player3','player4'].forEach(id=>{
    const p = profiles.players[id];
    const best = Math.max(0, ...Object.values(p.bestByQuiz||{}), 0);
    const el = document.getElementById('stats-'+id);
    if(el) el.textContent = `${p.totalPlayed} quiz • ${best}% meilleur`;
    document.querySelectorAll(`.profile-card[data-id="${id}"] .name`).forEach(n=>n.textContent=p.name);
    const card = document.querySelector(`.profile-card[data-id="${id}"]`);
    if(card){ if(profiles.selected===id) card.classList.add('active'); else card.classList.remove('active'); }
  });
}

export async function selectProfile(id){
  if(!profiles) return;
  profiles.selected = id;
  await save({ selected:id });
  render();
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

export async function resetCurrentProfile(){
  if(!profiles) return;
  const id = profiles.selected || 'player1';
  if(!confirm('Réinitialiser toutes les stats de '+profiles.players[id].name+' ?')) return;
  profiles.players[id] = {name:profiles.players[id].name, icon:profiles.players[id].icon, totalPlayed:0,totalCorrect:0,bestByQuiz:{},badges:[]};
  await save({ players: profiles.players });
  render();
}

/** Enregistre un résultat de quiz pour le profil sélectionné */
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
  const prev = p.bestByQuiz[key] || 0;
  if(percent > prev) p.bestByQuiz[key] = percent;

  // Badges simples
  if(!p.badges) p.badges = [];
  const give = (code, label)=>{ if(!p.badges.find(b=>b.code===code)) p.badges.push({code,label,ts:Date.now()}); };
  if(p.totalPlayed === 1) give('first_quiz','Premier quiz !');
  if(percent === 100) give('perfect','Score parfait (100%)');
  if(p.totalPlayed === 10) give('ten_quizzes','10 quiz joués');
  if((p.totalCorrect||0) >= 100) give('cent_bonnes','100 bonnes réponses');

  await save({ players: profiles.players });
  render();
}

// expose
window.PROFILES = { selectProfile, renameProfile, resetCurrentProfile, updateFromQuiz };
