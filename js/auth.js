import { auth } from './firebase.js';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { showAuth, showProfiles, $, msg } from './ui.js';
import * as PROFILES from './profiles.js';

const BASE_PATH = "/QUIZZ-6EME/";

export async function sendLink(){
  const email = $('#email').value.trim();
  if(!email){ alert('Entre une adresse e‑mail'); return; }
  const actionCodeSettings = { url: location.origin + BASE_PATH, handleCodeInApp: true };
  try{
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    msg('Lien envoyé à '+email+' (regarde SPAM si besoin).');
  }catch(e){ alert(e.message); msg('Erreur: '+e.message); console.error(e); }
}

export async function completeFromLink(){
  const href = window.location.href;
  if(isSignInWithEmailLink(auth, href)){
    let email = localStorage.getItem('emailForSignIn');
    if(!email) email = prompt('Confirme ton e‑mail pour te connecter');
    const cred = await signInWithEmailLink(auth, email, href);
    localStorage.removeItem('emailForSignIn');
    history.replaceState({}, document.title, BASE_PATH);
  }
}

export function bindAuthState(){
  onAuthStateChanged(auth, async (user)=>{
    const who = document.getElementById('who');
    if(!user){ who.textContent='Non connecté'; showAuth(); return; }
    who.textContent = user.email || 'Connecté';
    await PROFILES.load(user.uid);
    showProfiles();
  });
}

export function logout(){ return signOut(auth); }

window.AUTH = { sendLink, logout };
