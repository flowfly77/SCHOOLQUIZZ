// js/integrator.js
import * as PROFILES from './profiles.js';
import { showQuiz } from './ui.js';

async function loadHtmlInto(el, url){
  const html = await fetch(url, {cache:'no-store'}).then(r=>r.text());
  el.innerHTML = html;
}

function ensureScriptOnce(src){
  if (document.querySelector('script[data-v3bundle="1"]')) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = false;
  s.dataset.v3bundle = "1";
  document.body.appendChild(s);
}

function autoDetectResults(){
  const root = document.getElementById('quiz-root');
  if(!root) return;
  const rx = /(?:(\d+)\s*\/\s*(\d+))|(?:(\d+)\s*sur\s*(\d+))/i;
  let lastReported = '';
  const obs = new MutationObserver(()=>{
    const txt = (root.textContent || '').slice(0, 2000);
    const m = txt.match(rx);
    if(m){
      const score = Number(m[1]||m[3]||0);
      const total = Number(m[2]||m[4]||0);
      const sig = score + '/' + total;
      if(total>0 && sig !== lastReported){
        lastReported = sig;
        PROFILES.updateFromQuiz({ key:'quiz_v3', correct:score, total, title:document.title||'Quiz' });
      }
    }
  });
  obs.observe(root, { childList:true, subtree:true, characterData:true });
}

export async function loadIntoQuizRoot(){
  showQuiz();
  const root = document.getElementById('quiz-root');
  await loadHtmlInto(root, './assets/partials/v3_body.html');
  ensureScriptOnce('./js/v3_bundle.js');

  window.envoyerResultatQuiz = function(key, bonnesReponses, totalQuestions, titre){
    PROFILES.updateFromQuiz({ key, correct:Number(bonnesReponses)||0, total:Number(totalQuestions)||0, title:titre||'' });
  };

  autoDetectResults();
}

window.V3 = { loadIntoQuizRoot };
