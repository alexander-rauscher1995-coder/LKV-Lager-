/* FITNESS COACH PRO — Nutrition Experience Layer */
(function(){
'use strict';
const MEAL='fitness_v98_nutrition', CAL='fitness_v86_calories', HYD='fitness_v84_hydration';
function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
function today(){return new Date().toISOString().slice(0,10)}
function meals(){const x=read(MEAL,{meals:[]});return Array.isArray(x)?x:(x.meals||[])}
function cal(){return read(CAL,{})||{}}
function render(){
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
window.nutritionProRefresh=render;
window.addEventListener('load',()=>setTimeout(render,550));
window.addEventListener('fitness-cloud-status',render);
setInterval(()=>{if(document.getElementById('nutritionProPanel'))render()},15000);
})();
