/* FITNESS PRO V174 — Calculator experience layer */
(function(){
  'use strict';

  const STYLE_ID='fitness-pro-calculator-v174';
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
  .calculator-pro-shell{margin-bottom:12px}
  .calculator-pro-section-label{display:flex;align-items:center;gap:8px;margin:14px 0 7px;color:#82919a;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
  .calculator-pro-section-label i{width:22px;height:1px;background:rgba(99,245,154,.5);display:block}
  .calculator-pro-flow button{transition:.18s ease}.calculator-pro-flow button:hover{border-color:rgba(99,245,154,.45)!important;transform:translateY(-1px)}
  .calculator-pro-person-grid .pitem{transition:.18s ease}.calculator-pro-person-grid .pitem:hover{border-color:rgba(99,245,154,.28);transform:translateY(-1px)}
  .calculator-pro-new{display:grid;gap:12px}
  .calculator-pro-card{padding:18px;border:1px solid #26343c;border-radius:18px;background:linear-gradient(145deg,#101a20,#0c151a);box-shadow:0 10px 28px rgba(0,0,0,.14)}
  .calculator-pro-card.accent{border-color:rgba(99,245,154,.24);background:radial-gradient(circle at 90% 0%,rgba(99,245,154,.11),transparent 35%),linear-gradient(145deg,#12221b,#0c151a)}
  .calculator-pro-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.calculator-pro-card-head h3{margin:0;font-size:17px}.calculator-pro-card-head p{margin:4px 0 0;color:#82919a;font-size:11px;line-height:1.4}
  .calculator-pro-badge{font-size:9px;color:#7f918a;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap}
  .calculator-pro-form{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:13px}.calculator-pro-field label{display:block;font-size:9px;color:#82919a;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}.calculator-pro-field input,.calculator-pro-field select{width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid #2b3a42;background:#0b1419;color:#eef4f6;font-size:14px;outline:none}.calculator-pro-field input:focus,.calculator-pro-field select:focus{border-color:rgba(99,245,154,.55);box-shadow:0 0 0 3px rgba(99,245,154,.07)}
  .calculator-pro-choice{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:13px}.calculator-pro-choice button{padding:13px;border-radius:13px;border:1px solid #2b3a42;background:#0b1419;color:#eef4f6;text-align:left;cursor:pointer}.calculator-pro-choice button.active{border-color:rgba(99,245,154,.65);background:rgba(99,245,154,.08)}.calculator-pro-choice b{display:block;font-size:13px}.calculator-pro-choice small{display:block;color:#82919a;margin-top:3px;font-size:10px}
  .calculator-pro-result{display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:9px;margin-top:13px}.calculator-pro-result .r{padding:14px;border-radius:14px;background:#0b1419;border:1px solid #26343c}.calculator-pro-result span{display:block;color:#82919a;font-size:9px;text-transform:uppercase;letter-spacing:.08em}.calculator-pro-result b{display:block;font-size:24px;margin-top:4px}.calculator-pro-result small{color:#82919a}
  @media(max-width:700px){.calculator-pro-form{grid-template-columns:repeat(2,1fr)}.calculator-pro-choice,.calculator-pro-result{grid-template-columns:1fr}.calculator-pro-card{padding:15px}}
  .calculator-pro-person{margin:0 0 12px;padding:18px;border-radius:18px;border:1px solid rgba(99,245,154,.22);background:radial-gradient(circle at 85% 10%,rgba(99,245,154,.10),transparent 35%),linear-gradient(135deg,#12221b,#10181d);box-shadow:0 8px 24px rgba(0,0,0,.12)}
  .calculator-pro-person-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.calculator-pro-person-head b{font-size:18px;font-weight:850}.calculator-pro-person-head span{font-size:10px;color:#7f918a;text-transform:uppercase;letter-spacing:.12em}
  .calculator-pro-person-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:12px}.calculator-pro-person-grid .pitem{padding:12px;border-radius:14px;background:rgba(7,16,22,.5);border:1px solid rgba(153,176,187,.12)}.calculator-pro-person-grid small{display:block;color:#82919a;font-size:10px;text-transform:uppercase;letter-spacing:.07em}.calculator-pro-person-grid b{display:block;font-size:19px;margin-top:5px}
  @media(max-width:700px){.calculator-pro-person-grid{grid-template-columns:repeat(2,1fr)}}


  function n(v){return Number.isFinite(Number(v))?Number(v):0}
  function pct(v,max){return max?Math.min(100,Math.max(0,Math.round(v/max*100))):0}

  function bindLiveResultUpdates(){
    if(window.__fitnessCalcLiveBound) return;
    window.__fitnessCalcLiveBound=true;
    const sheet=document.getElementById('moduleSheet');
    if(!sheet) return;
    const refresh=()=>{
      try{
        if(!sheet.classList.contains('module-calculator')) return;
        ['.calculator-pro-hero','.calculator-pro-summary','.calculator-pro-result-summary','.calculator-pro-mode','.calculator-pro-daytype','.calculator-pro-coaching'].forEach(sel=>{
          document.querySelectorAll(sel).forEach(el=>el.remove());
        });
        enhance();
      }catch(e){console.warn(e)}
    };
    sheet.addEventListener('input',()=>{clearTimeout(window.__fitnessCalcLiveTimer);window.__fitnessCalcLiveTimer=setTimeout(refresh,180)});
    sheet.addEventListener('change',refresh);
  }

  function buildNewCalculatorShell(){
    const sheet=document.getElementById('moduleSheet');
    const main=sheet?.querySelector('.calculator-main');
    if(!sheet||!main||sheet.__newCalculatorBuilt) return;
    sheet.__newCalculatorBuilt=true;
    main.style.display='none';

    const shell=document.createElement('div');
    shell.className='calculator-pro-new';
    const get=(id)=>document.getElementById(id);
    const state=window.calorieState||{};
    const activity=Number(state.activity||1.2);
    const goal=String(state.goal||'maintain');
    shell.innerHTML=`
      <div class="calculator-pro-card accent">
        <div class="calculator-pro-card-head"><div><h3>1 · Person</h3><p>Deine Ausgangsdaten für die Berechnung.</p></div><span class="calculator-pro-badge">Basis</span></div>
        <div class="calculator-pro-form">
          <div class="calculator-pro-field"><label>Alter</label><input id="proAge" type="number" min="1" max="120" value="${state.age||''}"></div>
          <div class="calculator-pro-field"><label>Größe · cm</label><input id="proHeight" type="number" min="80" max="230" value="${state.height||''}"></div>
          <div class="calculator-pro-field"><label>Gewicht · kg</label><input id="proWeight" type="number" min="25" max="250" step="0.1" value="${state.weight||''}"></div>
          <div class="calculator-pro-field"><label>Geschlecht</label><select id="proSex"><option value="m" ${state.sex==='m'?'selected':''}>Männlich</option><option value="f" ${state.sex==='f'?'selected':''}>Weiblich</option></select></div>
        </div>
      </div>
      <div class="calculator-pro-card">
        <div class="calculator-pro-card-head"><div><h3>2 · Aktivität</h3><p>Alltag, Training und Cardio werden separat berücksichtigt.</p></div><span class="calculator-pro-badge">Aktivität</span></div>
        <div class="calculator-pro-form">
          <div class="calculator-pro-field"><label>Alltag</label><select id="proActivity"><option value="1.2">Wenig aktiv</option><option value="1.375">Leicht aktiv</option><option value="1.55">Moderat aktiv</option><option value="1.725">Sehr aktiv</option><option value="1.9">Extrem aktiv</option></select></div>
          <div class="calculator-pro-field"><label>Schritte / Tag</label><input id="proSteps" type="number" min="0" max="50000" step="500" value="${state.steps||0}"></div>
          <div class="calculator-pro-field"><label>Krafttraining / Woche</label><select id="proTrainingDays">${[0,1,2,3,4,5,6,7].map(v=>'<option value="'+v+'" '+(Number(state.trainingDays||0)===v?'selected':'')+'>'+v+'×</option>').join('')}</select></div>
          <div class="calculator-pro-field"><label>Minuten / Einheit</label><select id="proTrainingMinutes">${[30,45,60,75,90,120].map(v=>'<option value="'+v+'" '+(Number(state.trainingMinutes||60)===v?'selected':'')+'>'+v+' min</option>').join('')}</select></div>
        </div>
      </div>
      <div class="calculator-pro-card">
        <div class="calculator-pro-card-head"><div><h3>3 · Ziel & Profil</h3><p>Die Zielauswahl verändert bei Minderjährigen nicht die Energie-Vorgabe.</p></div><span class="calculator-pro-badge">Ziel</span></div>
        <div class="calculator-pro-choice">
          <button type="button" data-pro-goal="lose" class="${goal==='lose'?'active':''}"><b>Abnehmen</b><small>neutrale Orientierung</small></button>
          <button type="button" data-pro-goal="maintain" class="${goal==='maintain'?'active':''}"><b>Erhalt</b><small>neutrale Orientierung</small></button>
          <button type="button" data-pro-goal="bulk" class="${goal==='bulk'?'active':''}"><b>Aufbau</b><small>neutrale Orientierung</small></button>
        </div>
      </div>
      <div class="calculator-pro-card accent">
        <div class="calculator-pro-card-head"><div><h3>4 · Ergebnis</h3><p>Deine aktuelle Energie-Orientierung wird automatisch aktualisiert.</p></div><span class="calculator-pro-badge">Live</span></div>
        <div class="calculator-pro-result">
          <div class="r"><span>Tagesbedarf</span><b id="proResultTarget">–</b><small>kcal / Tag</small></div>
          <div class="r"><span>Grundumsatz</span><b id="proResultBmr">–</b><small>kcal</small></div>
          <div class="r"><span>Modus</span><b id="proResultMode" style="font-size:15px">–</b><small>Berechnungsprofil</small></div>
        </div>
      </div>`;
    sheet.querySelector('.module-head')?.after(shell);
    const sync=()=>{
      try{
        const map=[['proAge','caCoach'],['proHeight','chCoach'],['proWeight','cwCoach'],['proSex','csCoach'],['proSteps','csteps'],['proTrainingDays','calcTrainingDays'],['proTrainingMinutes','calcTrainingMinutes']];
        map.forEach(([a,b])=>{const v=get(a),t=get(b);if(v&&t)t.value=v.value;});
        if(typeof setActivity==='function') setActivity(Number(get('proActivity')?.value||1.2),'calculator');
        if(typeof setTrainingProfile==='function') setTrainingProfile(get('proTrainingDays')?.value||0,get('proTrainingMinutes')?.value||60,'calculator');
        map.forEach(([a,b])=>get(b)?.dispatchEvent(new Event('input',{bubbles:true})));
        if(typeof calculateAndStay==='function') calculateAndStay();
        renderResult();
      }catch(e){}
    };
    const renderResult=()=>{
      try{
        const p=typeof calcBreakdown==='function'?calcBreakdown():{};
        const target=typeof calcTarget==='function'?Number(calcTarget()):Number(p.total||0);
        const mode={lose:'Abnehmen',maintain:'Erhalt',bulk:'Aufbau'}[String(window.calorieState?.goal||'maintain')]||'Erhalt';
        get('proResultTarget').textContent=Math.round(target).toLocaleString('de-DE');
        get('proResultBmr').textContent=Math.round(Number(p.bmr||0)).toLocaleString('de-DE');
        get('proResultMode').textContent=mode;
      }catch(e){}
    };
    get('proActivity').value=String(activity);
    [...shell.querySelectorAll('input,select')].forEach(el=>el.addEventListener('input',sync));
    [...shell.querySelectorAll('select')].forEach(el=>el.addEventListener('change',sync));
    shell.querySelectorAll('[data-pro-goal]').forEach(btn=>btn.addEventListener('click',()=>{
      if(typeof setCalorieGoal==='function') setCalorieGoal(btn.dataset.proGoal,'calculator');
      shell.querySelectorAll('[data-pro-goal]').forEach(x=>x.classList.toggle('active',x===btn));
      renderResult();
    }));
    sync();
  }

  function enhance(){
    const sheet=document.getElementById('moduleSheet');
    if(!sheet.querySelector('.calculator-pro-person')){
      const person=document.createElement('div');
      person.className='calculator-pro-person';
      const age=n(state.age), height=n(state.height), pw=n(state.weight);
      const sex=state.sex==='f'?'Weiblich':state.sex==='m'?'Männlich':'–';
      person.innerHTML='<div class="calculator-pro-person-head"><b>Personendaten</b><span>Schritt 1 · Grundlage</span></div><div class="calculator-pro-person-grid"><div class="pitem"><small>Alter</small><b>'+ (age||'–') +' Jahre</b></div><div class="pitem"><small>Größe</small><b>'+ (height||'–') +' cm</b></div><div class="pitem"><small>Gewicht</small><b>'+ (pw||'–') +' kg</b></div><div class="pitem"><small>Geschlecht</small><b>'+sex+'</b></div></div>';
      const main=sheet.querySelector('.calculator-main');
      if(main){
        const label=document.createElement('div');
        label.className='calculator-pro-section-label';
        label.innerHTML='<i></i>Person · Ausgangsdaten';
        main.before(label);
        main.before(person);
      }
    }

    // Guided calculator flow: Person → Aktivität → Ziel → Ergebnis
    if(!sheet.querySelector('.calculator-pro-flow')){
      const flow=document.createElement('div');
      flow.className='calculator-pro-flow';
      flow.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:0 0 12px;padding:8px;border:1px solid #26343c;border-radius:14px;background:#0b1419';
      flow.innerHTML=[
        ['1','Person','Körperdaten'],
        ['2','Aktivität','Alltag + Training'],
        ['3','Ziel','Zielrichtung'],
        ['4','Ergebnis','Übersicht']
      ].map(([n,t,d])=>'<button type="button" data-flow="'+n+'" style="border:1px solid #26343c;background:#101a20;color:#dce5e8;border-radius:10px;padding:9px 6px;text-align:left;cursor:pointer"><span style="display:block;font-size:9px;color:#82919a">SCHRITT '+n+'</span><b style="display:block;font-size:12px;margin-top:2px">'+t+'</b><small style="display:block;color:#82919a;font-size:9px;margin-top:2px">'+d+'</small></button>').join('');
      const main=sheet.querySelector('.calculator-main');
      if(main) main.before(flow);
      const steps=[...sheet.querySelectorAll('.calculator-main .calc-step')];
      flow.querySelectorAll('[data-flow]').forEach(btn=>btn.addEventListener('click',()=>{
        const n=Number(btn.dataset.flow);
        if(n<=steps.length){
          steps[n-1]?.scrollIntoView({behavior:'smooth',block:'start'});
        }else if(n===4){
          document.querySelector('.calculator-pro-hero')?.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }));
    }

    if(!sheet || !sheet.classList.contains('module-calculator')) return;
    if(sheet.querySelector('.calculator-pro-hero')) return;

    const parts=typeof calcBreakdown==='function'?calcBreakdown():{};
    const maintenance=Math.round(n(parts.total));
    const target=typeof calcTarget==='function'?n(calcTarget()):maintenance;
    const bmr=Math.round(n(parts.bmr));
    const exactMaintenance=Math.round(n(parts.total));
    const displayMaintenance=maintenance;
    const macros=typeof macroTargets==='function'?(macroTargets()||{}):{};
    const state=window.calorieState||{};
    const weight=n(state.weight)||n(document.getElementById('cwCoach')?.value);
    const steps=n(state.steps)||n(document.getElementById('csteps')?.value);
    const goal=String(state.goal||'maintain');
    const goalNames={lose:'Abnehmen · neutrale Orientierung',maintain:'Erhalt · neutrale Orientierung',bulk:'Aufbau · neutrale Orientierung',muscle:'Muskelaufbau · neutrale Orientierung',strength:'Kraft & Leistung · neutrale Orientierung',fitness:'Allgemeine Fitness · neutrale Orientierung',recovery:'Erholung · neutrale Orientierung'};
    const goalName=goalNames[goal]||goalNames.maintain;

    const head=sheet.querySelector('.module-head');
    const main=sheet.querySelector('.calculator-main');
    if(!main) return;

    const weeklyAvg = maintenance ? Math.round(maintenance) : 0;
    const goalMode={
      lose:{title:'Gewichtsorientierung',desc:'Neutraler Tagesbedarf ohne Defizitvorgabe'},
      maintain:{title:'Erhalt & Fitness',desc:'Neutraler Tagesbedarf für den Alltag'},
      bulk:{title:'Leistungsorientierung',desc:'Training und Regeneration berücksichtigen'},
      muscle:{title:'Leistungsorientierung',desc:'Training und Regeneration berücksichtigen'},
      strength:{title:'Kraft & Leistung',desc:'Trainingstag und Leistungsbedarf berücksichtigen'},
      fitness:{title:'Allgemeine Fitness',desc:'Alltag, Training und Cardio berücksichtigen'},
      recovery:{title:'Erholung',desc:'Regeneration und Tagesbedarf im Blick'}
    }[goal]||{title:'Erhalt & Fitness',desc:'Neutraler Tagesbedarf für den Alltag'};

    const hero=document.createElement('div');
    hero.className='calculator-pro-hero';
    hero.innerHTML=`
      <div>
        <div class="calculator-pro-kicker">FITNESS COACH PRO · TAGESENERGIE</div>
        <div class="calculator-pro-title">Dein Energie-Dashboard</div>
        <div class="calculator-pro-sub">Der geschätzte Erhaltungsbedarf bleibt die neutrale Energie-Orientierung. Aktuelle Auswahl: <b>${goalName}</b>.</div>
        <div class="calculator-pro-number">${target.toLocaleString('de-DE')} <small>kcal / Tag · Tagesziel</small></div>
        <div style="margin-top:7px;color:#82919a;font-size:12px">Modus: <b style="color:#dce5e8">${goalMode.title}</b> · ${goalMode.desc}<br>Erhaltungsbedarf: <b style="color:#dce5e8">${displayMaintenance.toLocaleString('de-DE')} kcal</b> · Berechnung: ${exactMaintenance.toLocaleString('de-DE')} kcal</div>
      </div>
      <div class="calculator-pro-side">
        <div class="calculator-pro-stat"><span>Grundumsatz</span><b>${bmr.toLocaleString('de-DE')}</b><small>kcal</small></div>
        <div class="calculator-pro-stat"><span>Berechnungsmodus</span><b style="font-size:14px">${goalMode.title}</b><small>${goalMode.desc}</small></div>
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
    const validation=document.createElement('div');
    validation.className='calculator-pro-input-validation';
    validation.style.cssText='margin:0 0 10px;padding:9px 11px;border-radius:10px;background:#0b1419;border:1px solid #26343c;color:#82919a;font-size:11px';
    const checks=[
      ['Alter',n(state.age),1,120],
      ['Größe',n(state.height),80,230],
      ['Gewicht',n(state.weight),25,250]
    ];
    const invalid=checks.filter(x=>x[1]&& (x[1]<x[2]||x[1]>x[3]));
    validation.innerHTML=invalid.length
      ? '<b style="color:#ffb4a8">Eingaben prüfen:</b> '+invalid.map(x=>x[0]).join(', ')+' außerhalb eines plausiblen Bereichs.'
      : '<b style="color:#dce5e8">Eingaben geprüft</b> · Keine offensichtlichen Wertefehler erkannt.';
    main.before(validation);

    const sync=document.createElement('div');
    sync.className='calculator-pro-sync-indicator';
    sync.style.cssText='margin:0 0 10px;padding:8px 11px;border-radius:10px;background:#0b1419;border:1px solid #26343c;color:#82919a;font-size:11px';
    sync.innerHTML='<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-right:7px"></span>Berechnung synchronisiert · Eingaben werden automatisch berücksichtigt';
    main.before(sync);

    const resultSummary=document.createElement('div');
    resultSummary.className='calculator-pro-result-summary';
    resultSummary.style.cssText='margin:0 0 12px;padding:15px;border-radius:16px;background:linear-gradient(145deg,#101d19,#0d171c);border:1px solid rgba(99,245,154,.22)';
    resultSummary.innerHTML='<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Ergebnis kompakt</div><div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:9px;margin-top:10px"><div class="summary-card"><span>Tagesbedarf</span><b style="font-size:25px">'+target.toLocaleString('de-DE')+'</b><small>kcal / Tag</small></div><div class="summary-card"><span>Grundumsatz</span><b>'+bmr.toLocaleString('de-DE')+'</b><small>kcal</small></div><div class="summary-card"><span>Zielmodus</span><b style="font-size:15px">'+goalMode.title+'</b><small>'+goalMode.desc+'</small></div></div>';
    main.before(resultSummary);



    if(!main.querySelector('.calculator-pro-mode')){
      const mode=document.createElement('div');
      mode.className='calculator-pro-mode';
      mode.style.cssText='margin:0 0 12px;padding:13px 14px;border-radius:14px;background:#0d171c;border:1px solid #26343c';
      mode.innerHTML='<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Berechnungsmodus</div><div style="font-size:16px;font-weight:850;margin-top:4px">'+goalMode.title+'</div><div style="font-size:11px;color:#82919a;margin-top:4px">'+goalMode.desc+'</div><div style="font-size:11px;color:#aab6bd;margin-top:8px">Die App zeigt hier bewusst nur eine neutrale Energie-Orientierung. Es werden keine Minus- oder Plus-Kalorien als Vorgabe ausgegeben.</div>';
      main.before(mode);
    }

    if(!main.querySelector('.calculator-pro-daytype')){
      const day=document.createElement('div');
      day.className='calculator-pro-daytype';
      day.style.cssText='margin:0 0 12px;padding:13px 14px;border-radius:14px;background:#101a20;border:1px solid #26343c';
      const training=n(state.trainingDays)>0;
      const cardio=n(state.cardioDays)>0;
      const active=training||cardio;
      day.innerHTML='<div style="font-size:10px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Tagesprofil</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px"><div class="summary-card"><span>Alltag</span><b>'+ (steps>0?'✓':'–') +'</b><small>'+steps.toLocaleString('de-DE')+' Schritte</small></div><div class="summary-card"><span>Training</span><b>'+ (training?'✓':'–') +'</b><small>'+n(state.trainingDays)+' Tage/Woche</small></div><div class="summary-card"><span>Cardio</span><b>'+ (cardio?'✓':'–') +'</b><small>'+n(state.cardioDays)+' Tage/Woche</small></div></div><div style="font-size:11px;color:#82919a;margin-top:9px">'+(active?'Aktivität wird im neutralen Tagesbedarf berücksichtigt.':'Ruhe-/Alltagsprofil wird verwendet.')+'</div>';
      main.before(day);
    }


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
      macroBox.innerHTML=`
        <div class="calculator-pro-macro">
          <div class="macro-top"><b>Protein</b><small>individuell</small></div>
          <div class="muted" style="font-size:11px;margin-top:4px">Bei Jugendlichen keine automatische Grammvorgabe</div>
          <div class="macro-track"><i style="width:72%"></i></div>
        </div>
        <div class="calculator-pro-macro">
          <div class="macro-top"><b>Kohlenhydrate</b><small>individuell</small></div>
          <div class="muted" style="font-size:11px;margin-top:4px">Nach Alltag, Training und Ernährung einordnen</div>
          <div class="macro-track"><i style="width:58%"></i></div>
        </div>
        <div class="calculator-pro-macro">
          <div class="macro-top"><b>Fett</b><small>individuell</small></div>
          <div class="muted" style="font-size:11px;margin-top:4px">Keine automatische Zielmenge</div>
          <div class="macro-track"><i style="width:45%"></i></div>
        </div>`;
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
      const direction=goalMode.title;
      coach.innerHTML=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px">
        <div class="summary-card"><span>Dein Tagesziel</span><b>${target.toLocaleString('de-DE')}</b><small>kcal / Tag</small></div>
        <div class="summary-card"><span>Wochensumme</span><b>${weekly.toLocaleString('de-DE')}</b><small>kcal / 7 Tage</small></div>
        <div class="summary-card"><span>Zielrichtung</span><b style="font-size:18px">${direction}</b><small>${goalMode.desc}</small></div>
      </div>`;
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

    if(!sheet.querySelector('.calculator-pro-last')){
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


    if(!sheet.querySelector('.calculator-pro-accessibility')){
      const access=document.createElement('div');
      access.className='calculator-pro-accessibility';
      access.style.cssText='margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid #26343c;background:#0b1419;font-size:11px;color:#82919a;line-height:1.45';
      access.innerHTML='<b style="color:#eef4f6">Bedienung optimiert</b><br>Alle Pro-Aktionen sind per Tastatur erreichbar. Die Diagrammwerte sind zusätzlich über die Zusammenfassung nachvollziehbar.';
      const trend=document.querySelector('.calculator-pro-trend');
      if(trend) trend.after(access); else main.before(access);
    }

    if(!sheet.querySelector('.calculator-pro-reset')){
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

    if(!sheet.querySelector('.calculator-pro-validation')){
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

    if(!sheet.querySelector('.calculator-pro-method')){
      const method=document.createElement('div');
      method.className='calculator-pro-method';
      method.style.cssText='margin-top:12px;padding:14px;border:1px solid #26343c;border-radius:14px;background:#0d171c';
      method.innerHTML='<div style="font-size:11px;color:#82919a;text-transform:uppercase;letter-spacing:.08em">Berechnung transparent</div><div style="font-size:14px;font-weight:800;margin-top:5px">Grundumsatz → Aktivität → Training/Cardio → Tagesziel</div><div style="font-size:11px;color:#82919a;line-height:1.45;margin-top:5px">Die einzelnen Bausteine werden separat dargestellt, damit Änderungen bei Eingaben nachvollziehbar bleiben.</div>';
      const tools=document.querySelector('.calculator-pro-tools');
      if(tools) tools.after(method); else main.before(method);
    }

    if(!sheet.querySelector('.calculator-pro-tools')){
      const tools=document.createElement('div');
      tools.className='calculator-pro-tools';
      tools.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
      tools.innerHTML='<button type="button" class="module-action calculator-pro-copy">Zusammenfassung kopieren</button><button type="button" class="module-action calculator-pro-share">Teilen</button>';
      const summary=document.querySelector('.calculator-pro-coaching') || document.querySelector('.calculator-pro-summary');
      if(summary) summary.after(tools); else main.before(tools);
      const getText=()=>{
        const parts=typeof calcBreakdown==='function'?calcBreakdown():{};
        const target=typeof calcTarget==='function'?n(calcTarget()):Math.round(n(parts.total));
        const macros=typeof macroTargets==='function'?(macroTargets()||{}):{};
        return ['Fitness Coach Pro – Rechner','Tagesziel: '+Math.round(target)+' kcal','Grundumsatz: '+Math.round(n(parts.bmr))+' kcal','Alltag/NEAT: +'+Math.round(n(parts.activity))+' kcal','Krafttraining: +'+Math.round(n(parts.training))+' kcal','Cardio: +'+Math.round(n(parts.cardio))+' kcal','Makros: individuelle Orientierung ohne automatische Grammvorgaben'].join('\
');
      };
      tools.querySelector('.calculator-pro-copy').onclick=async()=>{try{await navigator.clipboard.writeText(getText());tools.querySelector('.calculator-pro-copy').textContent='Kopiert';setTimeout(()=>tools.querySelector('.calculator-pro-copy').textContent='Zusammenfassung kopieren',1400)}catch(e){}};
      tools.querySelector('.calculator-pro-share').onclick=async()=>{try{if(navigator.share) await navigator.share({title:'Fitness Coach Pro',text:getText()});else await navigator.clipboard.writeText(getText())}catch(e){}};
    }

    if(!sheet.querySelector('.calculator-pro-footer')){
      const footer=document.createElement('div');
      footer.className='calculator-pro-footer';
      footer.innerHTML=`<div><b>Deine Energie-Orientierung</b><br><span>${target.toLocaleString('de-DE')} kcal · ${goalMode.title}</span></div><button class="module-action" type="button">Neu berechnen</button>`;
      footer.querySelector('button').onclick=()=>typeof calculateAndStay==='function'&&calculateAndStay();
      sheet.appendChild(footer);
    }
  }

  function installLive(){
    const sheet=document.getElementById('moduleSheet');
    if(!sheet || !sheet.classList.contains('module-calculator') || sheet.__proLive) return;
    sheet.__proLive=true;
    let timer;
    const syncFromFields=()=>{
      try{
        const pick=(...ids)=>ids.map(id=>document.getElementById(id)).find(el=>el && el.offsetParent!==null) || ids.map(id=>document.getElementById(id)).find(Boolean);
        const age=Number(pick('caCoach','ca')?.value);
        const height=Number(pick('chCoach','ch')?.value);
        const weight=Number(pick('cwCoach','cw')?.value);
        const sex=pick('csCoach','cs')?.value;
        const steps=Number(document.getElementById('csteps')?.value);
        const trainingDays=Number(document.getElementById('calcTrainingDays')?.value);
        const trainingMinutes=Number(document.getElementById('calcTrainingMinutes')?.value);
        const cardioDays=Number(document.getElementById('calcCardioDays')?.value);
        const cardioMinutes=Number(document.getElementById('calcCardioMinutes')?.value);
        const cardioType=document.getElementById('calcCardioType')?.value;
        if(Number.isFinite(age)&&age>0) calorieState.age=age;
        if(Number.isFinite(height)&&height>0) calorieState.height=height;
        if(Number.isFinite(weight)&&weight>0) calorieState.weight=weight;
        if(sex==='m'||sex==='f') calorieState.sex=sex;
        if(Number.isFinite(steps)&&steps>=0) calorieState.steps=Math.min(50000,Math.round(steps));
        if(Number.isFinite(trainingDays)) calorieState.trainingDays=Math.max(0,Math.min(7,trainingDays));
        if(Number.isFinite(trainingMinutes)) calorieState.trainingMinutes=Math.max(0,Math.min(180,trainingMinutes));
        if(Number.isFinite(cardioDays)) calorieState.cardioDays=Math.max(0,Math.min(7,cardioDays));
        if(Number.isFinite(cardioMinutes)) calorieState.cardioMinutes=Math.max(0,Math.min(180,cardioMinutes));
        if(cardioType) calorieState.cardioType=String(cardioType);
        if(Number.isFinite(cardioDays)) calorieState.cardioEnabled=cardioDays>0;
        if(typeof saveCalories==='function') saveCalories();
      }catch(e){}
    };
    const refresh=()=>{ clearTimeout(timer); timer=setTimeout(()=>{
      try{
        syncFromFields();
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
    sheet.addEventListener('change',()=>{syncFromFields();refresh()},{passive:true});
    refresh();
  }

  window.calculatorProRefresh=function(){
  bindLiveResultUpdates();
    try{
      const sheet=document.getElementById('moduleSheet');
      if(!sheet || !sheet.classList.contains('module-calculator')) return;
      const main=sheet.querySelector('.calculator-main');
      if(!main) return;
      buildNewCalculatorShell();
      ['.calculator-pro-hero','.calculator-pro-summary','.calculator-pro-macros','.calculator-pro-disclaimer','.calculator-pro-coaching','.calculator-pro-footer','.calculator-pro-goals'].forEach(sel=>{document.querySelectorAll(sel).forEach(el=>el.remove())});
      enhance();
    }catch(e){console.warn(e)}
  };

  function install(){
    const base=window.openModule;
    if(typeof base!=='function' || window.__fitnessCalculatorProInstalled) return;
    window.__fitnessCalculatorProInstalled=true;
    window.openModule=function(type){
      base.apply(this,arguments);
      if(type==='calculator') setTimeout(()=>{buildNewCalculatorShell();enhance();installLive()},20);
    };
  }
  document.addEventListener('DOMContentLoaded',()=>{install();setTimeout(install,500);setTimeout(install,1500)});
  window.addEventListener('load',()=>{install();setTimeout(install,300)});
})();
