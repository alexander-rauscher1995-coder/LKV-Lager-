/* FITNESS PRO V162 — Calculator experience layer */
(function(){
  'use strict';

  const STYLE_ID='fitness-pro-calculator-v162';
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
  .calculator-main{background:linear-gradient(145deg,#101b20,#0b1318)!important;border:1px solid rgba(99,245,154,.18)!important}
  .calculator-pro-hero{display:grid;grid-template-columns:1.35fr .65fr;gap:14px;padding:18px;margin-bottom:12px;border:1px solid rgba(99,245,154,.22);border-radius:18px;background:radial-gradient(circle at 85% 10%,rgba(99,245,154,.14),transparent 35%),linear-gradient(135deg,#12221b,#10181d)}
  .calculator-pro-kicker{font-size:10px;letter-spacing:.16em;font-weight:850;color:#7f918a}
  .calculator-pro-title{font-size:28px;font-weight:850;letter-spacing:-.6px;margin-top:5px}
  .calculator-pro-sub{font-size:13px;color:#9eacb4;line-height:1.45;margin-top:6px}
  .calculator-pro-number{font-size:44px;font-weight:900;letter-spacing:-1.5px;margin-top:10px}
  .calculator-pro-number small{font-size:16px;color:#89979f;font-weight:600}
  .calculator-pro-side{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .calculator-pro-stat{padding:12px;border-radius:14px;background:rgba(7,16,22,.5);border:1px solid rgba(153,176,187,.12)}
  .calculator-pro-stat span{display:block;font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em}
  .calculator-pro-stat b{display:block;font-size:20px;margin-top:5px}
  .calculator-pro-stat small{color:#82919a}
  .calculator-pro-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
  .calculator-pro-summary .summary-card{padding:14px;border-radius:15px;background:#101a20;border:1px solid #26343c}
  .summary-card span{display:block;color:#82919a;font-size:11px}.summary-card b{display:block;font-size:23px;margin-top:5px}.summary-card small{color:#82919a}
  .calculator-pro-goals{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:10px}
  .calculator-pro-goal{border:1px solid #2a3941;background:#101a20;border-radius:14px;padding:13px;text-align:left;cursor:pointer;color:#eef4f6}
  .calculator-pro-goal:hover{border-color:rgba(99,245,154,.35);transform:translateY(-1px)}
  .calculator-pro-goal.active{border-color:rgba(99,245,154,.65);background:rgba(99,245,154,.08);box-shadow:0 0 0 1px rgba(99,245,154,.08)}
  .calculator-pro-goal b{display:block}.calculator-pro-goal small{display:block;color:#82919a;margin-top:4px;line-height:1.3}
  .calculator-pro-macros{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px}
  .calculator-pro-macro{padding:13px;border-radius:14px;background:#0d171c;border:1px solid #26343c}
  .calculator-pro-macro .macro-top{display:flex;justify-content:space-between;gap:8px}.calculator-pro-macro b{font-size:18px}.calculator-pro-macro small{color:#82919a}
  .calculator-pro-macro .macro-track{height:7px;background:#26343c;border-radius:99px;overflow:hidden;margin-top:9px}.calculator-pro-macro i{display:block;height:100%;background:var(--accent);border-radius:99px}
  .calculator-pro-disclaimer{margin-top:12px;padding:11px 13px;border-radius:12px;background:#0b1419;border:1px solid #26343c;color:#8f9da5;font-size:11px;line-height:1.45}
  .calculator-pro-footer{position:sticky;bottom:0;z-index:7;display:flex;justify-content:space-between;align-items:center;gap:12px;margin:14px -24px -24px;padding:13px 24px;background:rgba(9,15,19,.94);backdrop-filter:blur(16px);border-top:1px solid #26343c}
  .calculator-pro-footer b{font-size:14px}.calculator-pro-footer span{color:#82919a;font-size:11px}
  @media(max-width:700px){.calculator-pro-hero{grid-template-columns:1fr}.calculator-pro-side{grid-template-columns:repeat(2,1fr)}.calculator-pro-summary,.calculator-pro-goals,.calculator-pro-macros{grid-template-columns:1fr}.calculator-pro-footer{margin-left:-18px;margin-right:-18px;padding-left:18px;padding-right:18px}}
  `;
  document.head.appendChild(style);

  function n(v){return Number.isFinite(Number(v))?Number(v):0}
  function pct(v,max){return max?Math.min(100,Math.max(0,Math.round(v/max*100))):0}

  function enhance(){
    const sheet=document.getElementById('moduleSheet');
    if(!sheet || !sheet.classList.contains('module-calculator')) return;
    if(sheet.querySelector('.calculator-pro-hero')) return;

    const parts=typeof calcBreakdown==='function'?calcBreakdown():{};
    const maintenance=Math.round(n(parts.total));
    const target=typeof calcTarget==='function'?n(calcTarget()):maintenance;
    const bmr=Math.round(n(parts.bmr));
    const macros=typeof macroTargets==='function'?(macroTargets()||{}):{};
    const state=window.calorieState||{};
    const weight=n(state.weight)||n(document.getElementById('cwCoach')?.value);
    const steps=n(state.steps)||n(document.getElementById('csteps')?.value);
    const goal=String(state.goal||'maintain');

    const head=sheet.querySelector('.module-head');
    const main=sheet.querySelector('.calculator-main');
    if(!main) return;

    const weeklyAvg = maintenance ? Math.round(maintenance) : 0;
    const targetDelta = target - maintenance;
    const targetLabel = targetDelta < 0 ? 'Defizit' : targetDelta > 0 ? 'Überschuss' : 'Erhalt';
\n    const hero=document.createElement('div');
    hero.className='calculator-pro-hero';
    hero.innerHTML=`
      <div>
        <div class="calculator-pro-kicker">FITNESS COACH PRO · TAGESENERGIE</div>
        <div class="calculator-pro-title">Dein Energie-Dashboard</div>
        <div class="calculator-pro-sub">Alle wichtigen Werte auf einen Blick – mit transparenter Aufschlüsselung der Berechnung.</div>
        <div class="calculator-pro-number">${target.toLocaleString('de-DE')} <small>kcal / Tag</small></div>
      </div>
      <div class="calculator-pro-side">
        <div class="calculator-pro-stat"><span>Grundumsatz</span><b>${bmr.toLocaleString('de-DE')}</b><small>kcal</small></div>
        <div class="calculator-pro-stat"><span>Zielwert</span><b>${target.toLocaleString('de-DE')}</b><small>kcal</small></div>
        <div class="calculator-pro-stat"><span>Gewicht</span><b>${weight.toLocaleString('de-DE')}</b><small>kg</small></div>
        <div class="calculator-pro-stat"><span>Schritte</span><b>${steps.toLocaleString('de-DE')}</b><small>/ Tag</small></div>
      </div>`;
    if(head) head.after(hero); else sheet.prepend(hero);

    const summary=document.createElement('div');
    summary.className='calculator-pro-summary';
    summary.innerHTML=`
      <div class="summary-card"><span>Alltag / NEAT</span><b>+${n(parts.activity).toLocaleString('de-DE')}</b><small>kcal</small></div>
      <div class="summary-card"><span>Krafttraining</span><b>+${n(parts.training).toLocaleString('de-DE')}</b><small>kcal / Tagesmittel</small></div>
      <div class="summary-card"><span>Cardio</span><b>+${n(parts.cardio).toLocaleString('de-DE')}</b><small>kcal / Tagesmittel</small></div>`;
    main.before(summary);

    const goalStep=[...main.querySelectorAll('.calc-step')].find(x=>x.textContent.includes('Ziel'));
    if(goalStep){
      const old=goalStep.querySelector('.calc-method');
      const box=document.createElement('div');
      box.className='calculator-pro-goals';
      const defs=[
        ['lose','Abnehmen','Energiebedarf als Orientierung'],
        ['maintain','Erhalt','Bedarf ungefähr abdecken'],
        ['bulk','Aufbau','Mehr Energie als Orientierung']
      ];
      box.innerHTML=defs.map(([id,label,desc])=>`<button type="button" class="calculator-pro-goal ${goal===id?'active':''}" data-goal="${id}"><b>${label}</b><small>${desc}</small></button>`).join('');
      goalStep.appendChild(box);
      box.querySelectorAll('[data-goal]').forEach(btn=>btn.addEventListener('click',()=>{
        if(typeof setCalorieGoal==='function') setCalorieGoal(btn.dataset.goal,'calculator');
      }));
      if(old) old.style.display='none';
    }

    const breakdown=sheet.querySelector('.calculator-breakdown');
    if(breakdown && !breakdown.querySelector('.calculator-pro-macros')){
      const macroBox=document.createElement('div');
      macroBox.className='calculator-pro-macros';
      const items=[
        ['Protein',macros.protein ?? macros.prot ?? macros.p,4],
        ['Kohlenhydrate',macros.carbs ?? macros.carbohydrates ?? macros.c,4],
        ['Fett',macros.fat ?? macros.fats ?? macros.f,9]
      ];
      macroBox.innerHTML=items.map(([label,val,kcal])=>{
        const grams=n(val), calories=grams*kcal;
        return `<div class="calculator-pro-macro"><div class="macro-top"><b>${grams} g</b><small>${calories.toLocaleString('de-DE')} kcal</small></div><div class="muted" style="font-size:11px;margin-top:4px">${label}</div><div class="macro-track"><i style="width:${pct(calories,Math.max(1,target))}%"></i></div></div>`;
      }).join('');
      const title=[...breakdown.querySelectorAll('h3')].find(x=>x.textContent.includes('Formel'));
      if(title) title.before(macroBox); else breakdown.prepend(macroBox);
    }

    if(!sheet.querySelector('.calculator-pro-disclaimer')){
      const note=document.createElement('div');
      note.className='calculator-pro-disclaimer';
      note.textContent='Orientierungswert: Der tatsächliche Energiebedarf kann vom Rechner abweichen. Für eine sinnvolle Einordnung zählt die Entwicklung über mehrere Wochen, nicht ein einzelner Tageswert.';
      const b=sheet.querySelector('.calculator-breakdown');
      if(b)b.appendChild(note);
    }

    if(!sheet.querySelector('.calculator-pro-coaching')){
      const coach=document.createElement('div');
      coach.className='calculator-pro-coaching';
      const weekly=Math.round(target*7);
      const direction=goal==='lose'?'Defizit-Ziel':goal==='bulk'?'Überschuss-Ziel':'Erhaltungs-Ziel';
      coach.innerHTML=\`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px">
        <div class="summary-card"><span>Dein Tagesziel</span><b>\${target.toLocaleString('de-DE')}</b><small>kcal / Tag</small></div>
        <div class="summary-card"><span>Wochensumme</span><b>\${weekly.toLocaleString('de-DE')}</b><small>kcal / 7 Tage</small></div>
        <div class="summary-card"><span>Zielrichtung</span><b style="font-size:18px">\${direction}</b><small>aktuelle Einstellung</small></div>
      </div>\`;
      const summary=document.querySelector('.calculator-pro-summary');
      if(summary) summary.after(coach); else main.before(coach);
    }







    if(!sheet.querySelector('.calculator-pro-history')){
      const history=document.createElement('div');
      history.className='calculator-pro-history';
      history.style.cssText='margin-top:12px;padding:14px;border-radius:14px;background:#0d171c;border:1px solid #26343c';
      const key='fitness_calculator_history_v1';
      const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}};
      const render=()=>{const items=read().slice(0,7);history.innerHTML='<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Berechnungsverlauf</div>'+ (items.length?items.map((v,i)=>'<div style="display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:'+(i<items.length-1?'1px solid #26343c':'0')+'"><span style="font-size:12px;color:#aab6bd">'+new Date(v.updatedAt).toLocaleString('de-DE')+'</span><b>'+Math.round(n(v.target)).toLocaleString('de-DE')+' kcal</b></div>').join(''):'<div style="font-size:11px;color:#82919a;margin-top:8px">Noch kein Verlauf vorhanden.</div>')};
      const save=()=>{try{const parts=typeof calcBreakdown==='function'?calcBreakdown():{};const target=typeof calcTarget==='function'?n(calcTarget()):Math.round(n(parts.total));const items=read();items.unshift({target,updatedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(items.slice(0,7)));render()}catch(e){}};
      render();
      const clear=document.createElement('button');
      clear.type='button';
      clear.className='module-action';
      clear.textContent='Verlauf löschen';
      clear.style.cssText='margin-top:10px';
      clear.onclick=()=>{try{localStorage.removeItem(key);render();}catch(e){}};
      history.appendChild(clear);
      const old=window.calculateAndStay;
      if(old && !window.__fitnessCalcHistoryWrapped){window.__fitnessCalcHistoryWrapped=true;window.calculateAndStay=function(){const r=old.apply(this,arguments);setTimeout(save,300);return r;};}
      const last=document.querySelector('.calculator-pro-last');
      if(last) last.after(history); else main.before(history);
    }
\n    if(!sheet.querySelector('.calculator-pro-last')){
      const last=document.createElement('div');
      last.className='calculator-pro-last';
      last.style.cssText='margin-top:12px;padding:13px 14px;border-radius:14px;background:#0d171c;border:1px solid #26343c';
      const key='fitness_calculator_last_v1';
      const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}};
      const write=()=>{try{const parts=typeof calcBreakdown==='function'?calcBreakdown():{};const target=typeof calcTarget==='function'?n(calcTarget()):Math.round(n(parts.total));localStorage.setItem(key,JSON.stringify({target,updatedAt:new Date().toISOString()}));}catch(e){}};
      const render=()=>{const v=read();last.innerHTML=v?'<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Letzte Berechnung</div><div style="font-size:18px;font-weight:850;margin-top:4px">'+Math.round(n(v.target)).toLocaleString('de-DE')+' kcal / Tag</div><div style="font-size:11px;color:#82919a;margin-top:3px">Gespeichert: '+new Date(v.updatedAt).toLocaleString('de-DE')+'</div>':'<div style="font-size:11px;color:#82919a">Noch keine vorherige Berechnung gespeichert.</div>';};
      const oldCalc=typeof calculateAndStay==='function'?calculateAndStay:null;
      if(oldCalc && !window.__fitnessCalcSaveWrapped){window.__fitnessCalcSaveWrapped=true;window.calculateAndStay=function(){const r=oldCalc.apply(this,arguments);setTimeout(()=>{write();render()},250);return r;};}
      render();
      const tools=document.querySelector('.calculator-pro-tools');
      if(tools) tools.after(last); else main.before(last);
    }
\n
    if(!sheet.querySelector('.calculator-pro-trend')){
      const trend=document.createElement('div');
      trend.className='calculator-pro-trend';
      trend.style.cssText='margin-top:12px;padding:14px;border-radius:14px;background:#0d171c;border:1px solid #26343c';
      trend.innerHTML='<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">7-Tage-Trend</div><div class="calculator-pro-trend-chart" style="height:120px;margin-top:10px;display:flex;align-items:flex-end;gap:7px"></div><div class="calculator-pro-trend-meta" style="font-size:11px;color:#82919a;margin-top:8px"></div>';
      const draw=()=>{try{const items=JSON.parse(localStorage.getItem('fitness_calculator_history_v1')||'[]').slice(0,7).reverse();const chart=trend.querySelector('.calculator-pro-trend-chart');const meta=trend.querySelector('.calculator-pro-trend-meta');if(!items.length){chart.innerHTML='<div style="color:#82919a;font-size:11px;align-self:center">Noch nicht genug Daten</div>';meta.textContent='Berechne den Rechner mehrfach, um den Verlauf aufzubauen.';return}const vals=items.map(x=>n(x.target));const min=Math.min(...vals),max=Math.max(...vals),range=Math.max(1,max-min);chart.innerHTML=items.map(x=>{const h=Math.max(12,Math.round(((n(x.target)-min)/range)*92)+12);return '<div title="'+Math.round(x.target)+' kcal" style="flex:1;height:'+h+'px;border-radius:7px 7px 3px 3px;background:var(--accent);opacity:.82"></div>'}).join('');meta.textContent='Min. '+Math.round(min).toLocaleString('de-DE')+' kcal · Max. '+Math.round(max).toLocaleString('de-DE')+' kcal · '+items.length+' Berechnungen';}catch(e){}}
      draw();
      const history=document.querySelector('.calculator-pro-history');
      if(history) history.after(trend); else main.before(trend);
    }
\n    if(!sheet.querySelector('.calculator-pro-reset')){
      const bar=document.createElement('div');
      bar.className='calculator-pro-reset';
      bar.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-top:10px';
      bar.innerHTML='<button type="button" class="module-action calculator-pro-reset-btn">Eingaben zurücksetzen</button>';
      const tools=document.querySelector('.calculator-pro-tools');
      if(tools) tools.before(bar); else main.before(bar);
      bar.querySelector('button').onclick=()=>{
        const ids=['cwCoach','cage','cheight','csteps'];
        ids.forEach(id=>{const el=document.getElementById(id);if(el) el.value='';});
        if(window.calorieState){['weight','age','height','steps'].forEach(k=>{if(k in window.calorieState) window.calorieState[k]='';});}
        const inputs=sheet.querySelectorAll('input');
        inputs.forEach(el=>{if(!['checkbox','radio'].includes(el.type)) el.value='';});
        sheet.querySelectorAll('select').forEach(el=>el.selectedIndex=0);
        if(typeof calculateAndStay==='function') calculateAndStay();
        bar.querySelector('button').textContent='Zurückgesetzt';
        setTimeout(()=>bar.querySelector('button').textContent='Eingaben zurücksetzen',1200);
      };
    }
\n    if(!sheet.querySelector('.calculator-pro-validation')){
      const validation=document.createElement('div');
      validation.className='calculator-pro-validation';
      validation.style.cssText='margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid #26343c;background:#0b1419;font-size:11px;line-height:1.45;color:#aab6bd';
      const refreshValidation=()=>{
        const checks=[];
        const w=n(window.calorieState?.weight)||n(document.getElementById('cwCoach')?.value);
        const age=n(window.calorieState?.age)||n(document.getElementById('cage')?.value);
        const h=n(window.calorieState?.height)||n(document.getElementById('cheight')?.value);
        if(w<=0) checks.push('Gewicht fehlt');
        if(age<=0) checks.push('Alter fehlt');
        if(h<=0) checks.push('Größe fehlt');
        validation.innerHTML=checks.length ? '<b style="color:#ffd27a">Eingaben prüfen</b><br>'+checks.join(' · ') : '<b style="color:#63f59a">Eingaben vollständig</b><br>Die grundlegenden Rechnerwerte sind vorhanden.';
      };
      refreshValidation();
      main.before(validation);
      sheet.addEventListener('input',refreshValidation,{passive:true});
      sheet.addEventListener('change',refreshValidation,{passive:true});
    }
\n    if(!sheet.querySelector('.calculator-pro-method')){
      const method=document.createElement('div');
      method.className='calculator-pro-method';
      method.style.cssText='margin-top:12px;padding:14px;border:1px solid #26343c;border-radius:14px;background:#0d171c';
      method.innerHTML='<div style="font-size:11px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Berechnung transparent</div><div style="font-size:14px;font-weight:800;margin-top:5px">Grundumsatz → Aktivität → Training/Cardio → Tagesziel</div><div style="font-size:11px;color:#82919a;line-height:1.45;margin-top:5px">Die einzelnen Bausteine werden separat dargestellt, damit Änderungen bei Eingaben nachvollziehbar bleiben.</div>';
      const tools=document.querySelector('.calculator-pro-tools');
      if(tools) tools.after(method); else main.before(method);
    }
\n    if(!sheet.querySelector('.calculator-pro-tools')){
      const tools=document.createElement('div');
      tools.className='calculator-pro-tools';
      tools.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
      tools.innerHTML='<button type="button" class="module-action calculator-pro-copy">Zusammenfassung kopieren</button><button type="button" class="module-action calculator-pro-share">Teilen</button>';
      const summary=document.querySelector('.calculator-pro-coaching') || document.querySelector('.calculator-pro-summary');
      if(summary) summary.after(tools); else main.before(tools);
      const getText=()=>{\n        const parts=typeof calcBreakdown==='function'?calcBreakdown():{};\n        const target=typeof calcTarget==='function'?n(calcTarget()):Math.round(n(parts.total));\n        const macros=typeof macroTargets==='function'?(macroTargets()||{}):{};\n        return ['Fitness Coach Pro – Rechner','Tagesziel: '+Math.round(target)+' kcal','Grundumsatz: '+Math.round(n(parts.bmr))+' kcal','Alltag/NEAT: +'+Math.round(n(parts.activity))+' kcal','Krafttraining: +'+Math.round(n(parts.training))+' kcal','Cardio: +'+Math.round(n(parts.cardio))+' kcal','Protein: '+(macros.protein ?? macros.prot ?? macros.p ?? 0)+' g','Kohlenhydrate: '+(macros.carbs ?? macros.carbohydrates ?? macros.c ?? 0)+' g','Fett: '+(macros.fat ?? macros.fats ?? macros.f ?? 0)+' g'].join('\\n');\n      };\n      tools.querySelector('.calculator-pro-copy').onclick=async()=>{try{await navigator.clipboard.writeText(getText());tools.querySelector('.calculator-pro-copy').textContent='Kopiert';setTimeout(()=>tools.querySelector('.calculator-pro-copy').textContent='Zusammenfassung kopieren',1400)}catch(e){}};\n      tools.querySelector('.calculator-pro-share').onclick=async()=>{try{if(navigator.share) await navigator.share({title:'Fitness Coach Pro',text:getText()});else await navigator.clipboard.writeText(getText())}catch(e){}};\n    }
\n    if(!sheet.querySelector('.calculator-pro-footer')){
      const footer=document.createElement('div');
      footer.className='calculator-pro-footer';
      footer.innerHTML=`<div><b>Dein Tagesziel</b><br><span>${target.toLocaleString('de-DE')} kcal · ${targetLabel} ${Math.abs(targetDelta).toLocaleString('de-DE')} kcal</span></div><button class="module-action" type="button">Neu berechnen</button>`;
      footer.querySelector('button').onclick=()=>typeof calculateAndStay==='function'&&calculateAndStay();
      sheet.appendChild(footer);
    }
  }

  function installLive(){
    const sheet=document.getElementById('moduleSheet');
    if(!sheet || !sheet.classList.contains('module-calculator') || sheet.__proLive) return;
    sheet.__proLive=true;
    let timer;
    const refresh=()=>{ clearTimeout(timer); timer=setTimeout(()=>{
      try{
        const main=sheet.querySelector('.calculator-main');
        if(!main) return;
        const before=document.querySelector('.calculator-pro-hero');
        if(before) before.remove();
        const summary=document.querySelector('.calculator-pro-summary');
        if(summary) summary.remove();
        const macro=document.querySelector('.calculator-pro-macros');
        if(macro) macro.remove();
        const note=document.querySelector('.calculator-pro-disclaimer');
        const coach=document.querySelector('.calculator-pro-coaching');
        if(coach) coach.remove();
        if(note) note.remove();
        const footer=document.querySelector('.calculator-pro-footer');
        if(footer) footer.remove();
        const goals=document.querySelector('.calculator-pro-goals');
        if(goals) goals.remove();
        enhance();
      }catch(e){}
    },180); };
    sheet.addEventListener('input',refresh,{passive:true});
    sheet.addEventListener('change',refresh,{passive:true});
    refresh();
  }

  function install(){
    const base=window.openModule;
    if(typeof base!=='function' || window.__fitnessCalculatorProInstalled) return;
    window.__fitnessCalculatorProInstalled=true;
    window.openModule=function(type){
      base.apply(this,arguments);
      if(type==='calculator') setTimeout(()=>{enhance();installLive()},20);
    };
  }
  document.addEventListener('DOMContentLoaded',()=>{install();setTimeout(install,500);setTimeout(install,1500)});
  window.addEventListener('load',()=>{install();setTimeout(install,300)});
})();
