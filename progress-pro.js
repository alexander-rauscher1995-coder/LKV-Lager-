/* Fitness Coach Pro — Progress PRO layer v2 */
(function(){
'use strict';
const KEY='fitness_progress_pro_v1';
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}}
function sessions(){return Array.isArray(read('fitness_v85_sessions',[]))?read('fitness_v85_sessions',[]):[]}
function data(){return read('fitness_v85_training_data',{})||{}}
function dateOf(x){return String(x?.date||x?.day||x?.createdAt||'').slice(0,10)}
function stats(){
 const s=sessions(), d=data(), names=Object.keys(d);
 const weights=[];
 names.forEach(n=>(Array.isArray(d[n])?d[n]:[]).forEach(v=>{const w=Number(String(v?.weight??'').replace(',','.'));if(Number.isFinite(w)&&w>0)weights.push({name:n,w,date:dateOf(v)})}));
 const dates=[...new Set(s.map(dateOf).filter(Boolean))].sort().slice(-28);
 const weekly=dates.map(dt=>({dt,count:s.filter(x=>dateOf(x)===dt).length}));
 const best=weights.sort((a,b)=>b.w-a.w)[0];
 const now=new Date(); now.setHours(0,0,0,0); const cutoff=new Date(now); cutoff.setDate(cutoff.getDate()-6); const prevCutoff=new Date(now); prevCutoff.setDate(prevCutoff.getDate()-13); const current7=s.filter(v=>{const dt=new Date(dateOf(v));return dt>=cutoff&&dt<=now}).length; const previous7=s.filter(v=>{const dt=new Date(dateOf(v));return dt>=prevCutoff&&dt<cutoff}).length; const delta=current7-previous7; const prs=names.reduce((n,name)=>{const vals=Array.isArray(d[name])?d[name]:[]; const nums=vals.map(v=>Number(String(v?.weight??'').replace(',','.'))).filter(Number.isFinite); return n+(nums.length>1&&nums.at(-1)>=Math.max(...nums.slice(0,-1))?1:0)},0); return {s,d,weights,dates,weekly,best,names,current7,previous7,delta,prs};
}
function inject(){
 if(document.getElementById('progressPro'))return;
 const host=document.querySelector('#progress .module-sheet')||document.querySelector('#progress');
 if(!host)return;
 const box=document.createElement('div');box.id='progressPro';box.className='progress-pro';
 box.innerHTML='<div class="pp-head"><div><div class="pp-kicker">PROGRESS PRO</div><h3>Leistungsentwicklung</h3><p>Training, Historie und gespeicherte Leistungswerte in einer Übersicht.</p></div><button class="pp-refresh" onclick="progressProRefresh()">↻ Aktualisieren</button></div><div id="ppBody"></div>';
 host.prepend(box);render();
}
function render(){
 const el=document.getElementById('ppBody');if(!el)return;
 const x=stats(), count=x.s.length, exercises=x.names.length, best=x.best?.w??0;
 const recent=x.s.slice().sort((a,b)=>dateOf(b).localeCompare(dateOf(a))).slice(0,6);
 const bars=x.weekly.length?x.weekly.map(v=>'<div class="pp-bar-wrap"><span>'+esc(v.dt.slice(5))+'</span><i style="height:'+Math.max(8,Math.min(100,v.count*28))+'%"></i><b>'+v.count+'</b></div>').join(''):'<div class="pp-empty">Noch keine Trainingshistorie gespeichert.</div>';
 const top=Object.entries(x.d).map(([name,vals])=>{const a=Array.isArray(vals)?vals:[];const ws=a.map(v=>Number(String(v?.weight??'').replace(',','.'))).filter(Number.isFinite);return {name,max:ws.length?Math.max(...ws):0,last:ws.at(-1)??0,n:ws.length}}).filter(v=>v.max>0).sort((a,b)=>b.max-a.max).slice(0,8);
 el.innerHTML='<div class="pp-kpis"><div><small>Einheiten</small><b>'+count+'</b></div><div><small>Übungen</small><b>'+exercises+'</b></div><div><small>Top-Gewicht</small><b>'+ (best?best.toLocaleString('de-DE')+' kg':'–')+'</b></div><div><small>Dokumentation</small><b>'+x.weights.length+'</b></div><div><small>7-Tage-Trend</small><b>'+ (x.delta>0?'+'+x.delta:x.delta)+'</b></div><div><small>Neue Bestwerte</small><b>'+x.prs+'</b></div></div>'+
 '<div class="pp-grid"><section class="pp-card"><div class="pp-title">Trainingsaktivität</div><div class="pp-chart">'+bars+'</div><small>Gespeicherte Einheiten pro Trainingstag</small></section>'+
 '<section class="pp-card"><div class="pp-title">Übungsentwicklung</div><div class="pp-exercises">'+(top.length?top.map(v=>'<div class="pp-ex"><span>'+esc(v.name)+'</span><b>'+v.max.toLocaleString('de-DE')+' kg</b><small>'+v.n+' Werte</small></div>').join(''):'<div class="pp-empty">Noch keine Gewichte dokumentiert.</div>')+'</div></section></div>'+
 '<section class="pp-card"><div class="pp-title">Letzte Einheiten</div><div class="pp-history">'+(recent.length?recent.map(v=>'<div><span>'+esc(dateOf(v)||'Ohne Datum')+'</span><b>'+esc(v.name||v.plan||v.title||'Training')+'</b></div>').join(''):'<div class="pp-empty">Noch keine Einheiten gespeichert.</div>')+'</div></section>';
}
window.progressProRefresh=function(){inject();render()};
window.addEventListener('load',()=>setTimeout(inject,520));
window.addEventListener('fitness-cloud-status',()=>setTimeout(progressProRefresh,80));
const style=document.createElement('style');style.textContent=`
.progress-pro{margin:0 0 14px;padding:16px;background:linear-gradient(145deg,rgba(22,34,41,.98),rgba(10,18,23,.98));border:1px solid rgba(99,245,154,.2);border-radius:18px}
.pp-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.pp-kicker{font-size:10px;letter-spacing:.14em;font-weight:800;color:#63f59a}.pp-head h3{margin:4px 0;font-size:22px}.pp-head p{margin:0;color:#8f9ca4;font-size:12px}.pp-refresh{border:1px solid #344049;background:#172128;border-radius:10px;padding:8px 11px;cursor:pointer}
.pp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.pp-kpis>div{background:#0d171c;border:1px solid #29363e;border-radius:12px;padding:11px}.pp-kpis small,.pp-ex small{display:block;color:#829099;font-size:11px}.pp-kpis b{display:block;font-size:20px;margin-top:4px}
.pp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.pp-card{background:#0d171c;border:1px solid #29363e;border-radius:13px;padding:13px}.pp-title{font-weight:800;margin-bottom:10px}.pp-chart{height:135px;display:flex;align-items:end;gap:7px;border-bottom:1px solid #29363e;padding:8px 4px 0}.pp-bar-wrap{height:100%;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:3px}.pp-bar-wrap i{display:block;width:100%;max-width:32px;background:#63f59a;border-radius:5px 5px 0 0;min-height:8px}.pp-bar-wrap span,.pp-bar-wrap b{font-size:9px;color:#829099}.pp-exercises,.pp-history{display:grid;gap:7px}.pp-ex{display:grid;grid-template-columns:1fr auto;gap:2px;padding:8px;background:#101b21;border-radius:9px}.pp-ex small{grid-column:1/-1}.pp-history>div{display:grid;grid-template-columns:90px 1fr;gap:10px;padding:9px;border-bottom:1px solid #25323a}.pp-history span{color:#829099;font-size:12px}.pp-empty{color:#829099;padding:10px 0;font-size:12px}
@media(max-width:650px){.pp-head{display:block}.pp-refresh{margin-top:10px}.pp-kpis{grid-template-columns:repeat(2,1fr)}.pp-grid{grid-template-columns:1fr}.pp-chart{height:120px}}
`;document.head.appendChild(style);
})();