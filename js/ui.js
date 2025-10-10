export const $ = (s)=>document.querySelector(s);
export function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
export function showAuth(){ show('#auth-screen'); document.getElementById('topbar').style.display='none'; }
export function showProfiles(){ show('#profiles-screen'); document.getElementById('topbar').style.display='flex'; }
export function showApp(){ show('#app-screen'); document.getElementById('topbar').style.display='flex'; }
export const msg = (t)=> document.getElementById('auth-msg').textContent = t || '';
