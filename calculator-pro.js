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
    const macros=typeof macroTargets==='function'?macroTargets():{protein:0,carbs:0,fat:0};
    const goal=String(window.calorieState?.goal||'maintain');

    const head=sheet.querySelector('.module-head');
    const main=sheet.querySelector('.calculator-main');
    if(!main) return;

    const hero=document.createElement('div');
    hero.className='calculator-pro-hero';
    hero.innerHTML=`
      <div>
        <div class="calculator-pro-kicker">FITNESS COACH PRO · TAGESENERGIE</div>
        <div class="calculator-pro-title">Dein Energie-Dashboard</div>
        <div class="calculator-pro-sub">Alle wichtigen Werte auf einen Blick – mit transparenter Aufschlüsselung der Berechnung.</div>
        <div class="calculator-pro-number">${maintenance.toLocaleString('de-DE')} <small>kcal / Tag</small></div>
      </div>
      <div class="calculator-pro-side">
        <div class="calculator-pro-stat"><span>Grundumsatz</span><b>${bmr.toLocaleString('de-DE')}</b><small>kcal</small></div>
        <div class="calculator-pro-stat"><span>Zielwert</span><b>${target.toLocaleString('de-DE')}</b><small>kcal</small></div>
        <div class="calculator-pro-stat"><span>Gewicht</span><b>${n(window.calorieState?.weight).toLocaleString('de-DE')}</b><small>kg</small></div>
        <div class="calculator-pro-stat"><span>Schritte</span><b>${n(window.calorieState?.steps).toLocaleString('de-DE')}</b><small>/ Tag</small></div>
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
      const items=[['Protein',macros.protein,4],['Kohlenhydrate',macros.carbs,4],['Fett',macros.fat,9]];
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

    if(!sheet.querySelector('.calculator-pro-footer')){
      const footer=document.createElement('div');
      footer.className='calculator-pro-footer';
      footer.innerHTML=`<div><b>Berechnung bereit</b><br><span>${maintenance.toLocaleString('de-DE')} kcal Tagesmittel</span></div><button class="module-action" type="button">Neu berechnen</button>`;
      footer.querySelector('button').onclick=()=>typeof calculateAndStay==='function'&&calculateAndStay();
      sheet.appendChild(footer);
    }
  }

  function install(){
    const base=window.openModule;
    if(typeof base!=='function' || window.__fitnessCalculatorProInstalled) return;
    window.__fitnessCalculatorProInstalled=true;
    window.openModule=function(type){
      base.apply(this,arguments);
      if(type==='calculator') setTimeout(enhance,20);
    };
  }
  document.addEventListener('DOMContentLoaded',()=>{install();setTimeout(install,500);setTimeout(install,1500)});
  window.addEventListener('load',()=>{install();setTimeout(install,300)});
})();
