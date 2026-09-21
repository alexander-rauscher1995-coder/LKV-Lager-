/* FITNESS COACH PRO — Nutrition Experience Layer */
(function(){
'use strict';
if(!document.getElementById('nutritionProStyle')){const s=document.createElement('style');s.id='nutritionProStyle';s.textContent=`
#nutritionProPanel{margin:0 0 14px;padding:18px;border:1px solid #26343c;border-radius:18px;background:linear-gradient(145deg,#101b20,#0c1419)}
.np-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.np-kicker{font-size:10px;color:#63f59a;font-weight:800;letter-spacing:.16em}.np-head h2{margin:4px 0;font-size:23px}.np-head p{margin:0;color:#85939b;font-size:12px}.np-refresh,.np-action{border:1px solid #344049;background:#172229;color:#eef4f6;border-radius:11px;padding:9px 12px;font-weight:700;cursor:pointer}.np-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.np-stats>div{padding:12px;border:1px solid #26343c;border-radius:13px;background:#0d161b}.np-stats span,.np-stats small{display:block;color:#84929a;font-size:10px}.np-stats b{display:block;font-size:21px;margin:4px 0}.np-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:10px;margin-top:10px}.np-card{padding:14px;border:1px solid #26343c;border-radius:14px;background:#0d161b}.np-card-head{display:flex;justify-content:space-between;gap:8px}.np-card h3{margin:0}.np-card-head span{font-size:10px;color:#7f8d95}.np-meals{display:grid;gap:7px;margin:12px 0}.np-meals>div{display:flex;gap:9px;align-items:flex-start;padding:9px;border-radius:10px;background:#101b21}.np-meals small{display:block;color:#7f8d95;margin-top:3px}.np-dot{color:#63f59a;font-size:20px;line-height:12px}.np-action{margin-top:8px;background:#63f59a;color:#07100b;border-color:#63f59a}.np-action.secondary{background:#172229;color:#eef4f6;border-color:#344049}.np-macro{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #202d34}.np-macro:last-of-type{border-bottom:0}.np-types{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}.np-types div{padding:10px;border:1px solid #26343c;border-radius:12px;text-align:center}.np-types span{display:block;color:#829098;font-size:10px}.np-types b{font-size:18px}.np-empty{color:#7f8d95;padding:12px}.module-nutrition #nutritionProPanel+ .module-head{margin-top:8px}
@media(max-width:650px){.np-head{display:block}.np-refresh{margin-top:10px}.np-stats,.np-grid,.np-types{grid-template-columns:1fr 1fr}.np-grid{grid-template-columns:1fr}.np-types{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(s)}
(function(){
'use strict';
const MEAL='fitness_v98_nutrition', CAL='fitness_v86_calories', HYD='fitness_v84_hydration';
function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
function today(){return new Date().toISOString().slice(0,10)}
function meals(){const x=read(MEAL,{meals:[]});return Array.isArray(x)?x:(x.meals||[])}
function cal(){return read(CAL,{})||{}}
function ensurePanel(){
 const sheet=document.querySelector('.module-sheet.module-nutrition');
 if(!sheet)return;
 let host=document.getElementById('nutritionProPanel');
 if(!host){host=document.createElement('div');host.id='nutritionProPanel';sheet.insertBefore(host,sheet.firstChild?.nextSibling||null)}
}
function render(){
 ensurePanel();
 const host=document.getElementById('nutritionProPanel'); if(!host)return;
 const all=meals(), day=all.filter(x=>x.date===today()), c=cal();
 const intake=Number(c.intake)||0, protein=Number(c.protein)||0, carbs=Number(c.carbs)||0, fat=Number(c.fat)||0;
 const target=Number(c.target||c.calorieTarget||0);
 const water=Number(localStorage.getItem(HYD)||0);
 const types={Frühstück:0,Mittagessen:0,Abendessen:0,Snack:0}; day.forEach(x=>{if(types[x.type]!=null)types[x.type]++});
 host.innerHTML=`
 <div class="np-head"><div><div class="np-kicker">ERNÄHRUNG PRO</div><h2>Dein Ernährungstagebuch</h2><p>Heute, Tageswerte und Verlauf übersichtlich zusammengeführt.</p></div><button class="np-refresh" onclick="window.nutritionProRefresh()">Aktualisieren</button></div>
 <div class="np-stats">
  <div><span>Mahlzeiten heute</span><b>${day.length}</b><small>Einträge</small></div>
  <div><span>Kalorien</span><b>${intake?intake.toLocaleString('de-DE'):'–'}</b><small>${target?'/ '+target.toLocaleString('de-DE')+' kcal':'Tageswert'}</small></div>
  <div><span>Protein</span><b>${protein?protein+' g':'–'}</b><small>gespeichert</small></div>
  <div><span>Wasser</span><b>${water.toFixed(1).replace('.',',')} L</b><small>Hydration</small></div>
 </div>
 <div class="np-grid">
  <section class="np-card"><div class="np-card-head"><h3>Heute</h3><span>${Object.values(types).reduce((a,b)=>a+b,0)} Einträge</span></div>
   <div class="np-meals">${day.length?day.slice().reverse().map(x=>`<div><span class="np-dot">•</span><div><b>${esc(x.type)} · ${esc(x.name)}</b><small>${x.note?esc(x.note):'Keine Notiz'}</small></div></div>`).join(''):'<div class="np-empty">Noch keine Mahlzeit für heute gespeichert.</div>'}</div>
   <button class="np-action" onclick="openModule('nutrition')">Mahlzeit eintragen →</button>
  </section>
  <section class="np-card"><div class="np-card-head"><h3>Makros</h3><span>gespeicherte Tageswerte</span></div>
   <div class="np-macro"><span>Protein</span><b>${protein||'–'} g</b></div>
   <div class="np-macro"><span>Kohlenhydrate</span><b>${carbs||'–'} g</b></div>
   <div class="np-macro"><span>Fett</span><b>${fat||'–'} g</b></div>
   <button class="np-action secondary" onclick="openModule('calories')">Kalorien & Ernährung öffnen →</button>
  </section>
 </div>
 <div class="np-types">${Object.entries(types).map(([k,v])=>`<div><span>${esc(k)}</span><b>${v}</b></div>`).join('')}</div>`;
}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
window.nutritionProRefresh=function(){ensurePanel();render()};
window.addEventListener('load',()=>setTimeout(render,550));
window.addEventListener('fitness-cloud-status',render);
setInterval(()=>{if(document.querySelector('.module-sheet.module-nutrition'))render()},15000);
})();
