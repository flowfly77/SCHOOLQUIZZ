// js/ui.js
export const $ = (s)=>document.querySelector(s);
export function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
export function showAuth(){ show('#auth-screen'); }
export function showProfiles(){ show('#profiles-screen'); }
export function showApp(){ show('#app-screen'); }
export const msg = (t)=> document.getElementById('auth-msg').textContent = t || '';
