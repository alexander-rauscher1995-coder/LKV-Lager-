/* FITNESS COACH PRO V2 — Training Experience Layer */
(function(){
  'use strict';
  const KEY='fitness_training_draft_v1';
  const SESS='fitness_v85_sessions';

  function sessions(){
    try{return JSON.parse(localStorage.getItem(SESS)||'[]')||[]}catch(e){return[]}
  }
  function trainingData(){
    try{return JSON.parse(localStorage.getItem('fitness_v85_training_data')||'{}')||{}}catch(e){return{}}
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function dateKey(v){return String(v||'').slice(0,10)}
  function stats(){
    const ss=sessions(), d=trainingData(), week=new Date(); week.setHours(0,0,0,0); week.setDate(week.getDate()-6);
    let volume=0, sets=0, best=0;
    Object.values(d).forEach(rows=>(Array.isArray(rows)?rows:[]).forEach(x=>{
      const w=parseFloat(String(x?.weight??'').replace(',','.')), r=parseFloat(String(x?.reps??'').replace(',','.'));
      if(Number.isFinite(w)){best=Math.max(best,w); if(Number.isFinite(r))volume+=w*r;}
    }));
    ss.slice(-30).forEach(s=>(s.rows?Object.values(s.rows):[]).forEach(rows=>(rows||[]).forEach(x=>{
      if(String(x?.weight??'').trim()||String(x?.reps??'').trim())sets++;
    })));
    const weekly=ss.filter(s=>new Date(s.date)>=week).length;
    return {count:ss.length,weekly,volume:Math.round(volume),sets,best,last:ss[ss.length-1]||null};
  }
  function render(){
    const page=document.querySelector('#training .training-page');
    if(!page)return;
    let box=document.getElementById('trainingProPanel');
    if(!box){box=document.createElement('div');box.id='trainingProPanel';box.className='training-pro-panel';page.insertBefore(box,page.querySelector('.actions')||null);}
    const x=stats(), last=x.last;
    const validation=document.getElementById('trainingProValidation')||document.createElement('div');
    validation.id='trainingProValidation';
    validation.className='training-pro-validation';
    validation.style.cssText='margin-top:10px;padding:10px 12px;border-radius:11px;border:1px solid #293840;background:#0d171c;color:#82919a;font-size:11px';
    const active=document.querySelectorAll('#training .exercise input').length;
    validation.innerHTML=active?'✓ Trainingsdaten bereit · Eingaben werden automatisch als Entwurf gespeichert.':'Noch keine Trainingsfelder geladen.';
    if(!validation.parentNode)box.appendChild(validation);


    const recent=sessions().slice(-5).reverse();
    box.innerHTML=`
      <div class="tp-head"><div><div class="tp-kicker">TRAINING PRO</div><h2>Dein Trainingszentrum</h2><p>Leistung, Volumen und Trainingshistorie auf einen Blick.</p></div><button class="tp-refresh" onclick="window.trainingProRefresh()">Aktualisieren</button></div>
      <div class="tp-stats">
        <div><span>Diese Woche</span><b>${x.weekly}</b><small>Einheiten</small></div>
        <div><span>Gesamt</span><b>${x.count}</b><small>gespeicherte Einheiten</small></div>
        <div><span>Volumen</span><b>${x.volume.toLocaleString('de-DE')}</b><small>kg × Wiederholungen</small></div>
        <div><span>Bestwert</span><b>${x.best?esc(x.best)+' kg':'–'}</b><small>höchstes gespeichertes Gewicht</small></div>
      </div>
      <div class="tp-grid">
        <section class="tp-card"><div class="tp-card-head"><h3>Letzte Einheiten</h3><span>${x.sets} dokumentierte Sätze</span></div>
          ${recent.length?'<div class="tp-history">'+recent.map(s=>`<div><div><b>GK ${esc(s.plan||'–')}</b><small>${new Date(s.date).toLocaleDateString('de-DE')} · ${s.completed??0}/${s.total??0} Sätze</small></div><strong>${Object.keys(s.rows||{}).length} Übungen</strong></div>`).join('')+'</div>':'<div class="tp-empty">Noch keine gespeicherten Einheiten.</div>'}
        </section>
        <section class="tp-card"><div class="tp-card-head"><h3>Trainingsstatus</h3><span>Live</span></div>
          <div class="tp-status-row"><span>Aktueller Plan</span><b>GK ${esc(window.currentPlan||'A')}</b></div>
          <div class="tp-status-row"><span>Letzte Einheit</span><b>${last?new Date(last.date).toLocaleDateString('de-DE'):'–'}</b></div>
          <div class="tp-status-row"><span>Dokumentation</span><b>${x.sets} Sätze</b></div>
          <button class="tp-action" onclick="window.trainingProOpenProgress()">Fortschritt öffnen →</button>
        </section>
      </div>`;
  }
  function draftSave(){
    const out={};
    document.querySelectorAll('#training .exercise').forEach(card=>{
      const name=card.querySelector('.exercise-name')?.textContent?.trim(); if(!name)return;
      out[name]=Array.from(card.querySelectorAll('input')).map(i=>i.value);
    });
    try{localStorage.setItem(KEY,JSON.stringify(out))}catch(e){}
  }
  function draftRestore(){
    let d={};try{d=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
    document.querySelectorAll('#training .exercise').forEach(card=>{
      const name=card.querySelector('.exercise-name')?.textContent?.trim(), vals=d[name];
      if(!Array.isArray(vals))return;
      const inputs=card.querySelectorAll('input'); vals.forEach((v,i)=>{if(inputs[i]&&v!==undefined)inputs[i].value=v});
    });
  }
  function bindLive(){
    if(window.__trainingProLiveBound)return;
    window.__trainingProLiveBound=true;
    const host=document.getElementById('training');
    if(!host)return;
    host.addEventListener('input',()=>{
      clearTimeout(window.__tpLive);
      window.__tpLive=setTimeout(()=>{draftSave();render()},500);
    });
    host.addEventListener('change',()=>{draftSave();render()});
  }

  function bind(){
    document.querySelectorAll('#training .exercise input').forEach(i=>{i.addEventListener('input',()=>{clearTimeout(window.__tpDraft);window.__tpDraft=setTimeout(draftSave,250)})});
  }
  window.trainingProRefresh=function(){render();bind();bindLive()};
  window.trainingProOpenProgress=function(){if(typeof openModule==='function')openModule('progress')};
  const oldRender=window.renderPlan;
  if(typeof oldRender==='function'&&!window.__trainingProWrapped){
    window.renderPlan=function(){oldRender.apply(this,arguments);setTimeout(()=>{draftRestore();bind();render()},0)};
    window.__trainingProWrapped=true;
  }
  window.addEventListener('load',()=>setTimeout(()=>{render();bind();bindLive();draftRestore();render()},500));
  window.addEventListener('fitness-cloud-status',render);
  setInterval(()=>{if(document.getElementById('training')?.classList.contains('active'))render()},15000);
})();
