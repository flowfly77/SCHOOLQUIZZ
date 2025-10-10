// js/auth.js
import { auth } from './firebase.js';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { showAuth, showProfiles, $, msg } from './ui.js';
import * as PROFILES from './profiles.js';

const BASE_PATH = "/QUIZZ-6EME/"; // <-- adapte si ton repo change

export async function sendLink(){
  const email = $('#email').value.trim();
  if(!email){ alert('Entre une adresse e-mail'); return; }

  const actionCodeSettings = { url: location.origin + BASE_PATH, handleCodeInApp: true };

  try{
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    localStorage.setItem('rememberMe', document.getElementById('remember')?.checked ? '1' : '0');
    msg('Lien envoyé à '+email+' (pense au dossier SPAM si besoin).');
  }catch(e){
    console.error(e);
    if(String(e.code||'').includes('quota')){
      alert("Limite quotidienne atteinte pour l'envoi de liens d'auth. Réessaie demain, ou active provisoirement 'mot de passe' dans Firebase pour tester."); 
    }else{
      alert(e.message);
    }
    msg('Erreur: '+e.message);
  }
}

export async function completeFromLink(){
  const href = window.location.href;
  if(!isSignInWithEmailLink(auth, href)) return;

  let email = localStorage.getItem('emailForSignIn');
  if(!email){
    email = prompt('Confirme ton e-mail pour te connecter');
    if(!email) return;
  }

  const remember = localStorage.getItem('rememberMe') === '1';
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

  await signInWithEmailLink(auth, email, href);
  localStorage.removeItem('emailForSignIn');
  history.replaceState({}, document.title, BASE_PATH);
}

export function bindAuthState(){
  onAuthStateChanged(auth, async (user)=>{
    if(!user){ showAuth(); return; }
    await PROFILES.load(user.uid);
    showProfiles();
  });
}

export function logout(){ return signOut(auth); }
window.AUTH = { sendLink, logout };
