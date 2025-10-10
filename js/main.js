
import './firebase-config.js'; // sets window.FB_CONFIG
import './firebase.js';        // initialize Firebase app/auth/db
import * as AUTH from './auth.js';
import * as UI from './ui.js';
import * as PROFILES from './profiles.js';

window.UI = { showProfiles: UI.showProfiles, goToApp: ()=>UI.showApp() };

AUTH.completeFromLink().then(()=>{
  AUTH.bindAuthState();
});

// Écoute les messages venant de V3 (iframe)
window.addEventListener('message', (e)=>{
  const d = e?.data;
  if(!d || typeof d !== 'object') return;
  if(d.type === 'quiz-finished'){
    PROFILES.updateFromQuiz({ key: d.key, correct: d.correct, total: d.total, title: d.title });
  }
});
