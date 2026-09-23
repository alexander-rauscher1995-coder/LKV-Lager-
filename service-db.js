const K='lcdb1',loc=['Allgäu','Lager','München','Außenstelle'];
let db=JSON.parse(localStorage.getItem(K)||'null')||{devices:[
{id:1,rep:'67882',sn:'24496',loc:'Allgäu',status:'Reparatur',tech:'Rauscher',note:'2x Core Dichtung; Akku getauscht'},
{id:2,rep:'67096',sn:'24496',loc:'Allgäu',status:'OK',tech:'Rauscher',note:'Akku 2590 mAh'}
],repairs:[
{date:'03.09.2026',rep:'67882',sn:'24496',type:'Reparatur',error:'Akku / Core Dichtung',action:'Akku getauscht; Messung korrigiert',tech:'Rauscher',state:'In Arbeit'},
{date:'28.04.2026',rep:'67096',sn:'24496',type:'Service',error:'Akku',action:'Akku 2590 mAh',tech:'Rauscher',state:'Erledigt'}
],items:[
{art:'1107',name:'Akku Lactocorder',min:5,stock:{'Allgäu':12,'Lager':8,'München':3,'Außenstelle':2}},
{art:'1204',name:'Core Dichtung',min:10,stock:{'Allgäu':18,'Lager':24,'München':7,'Außenstelle':4}}
]};

function save(){localStorage.setItem(K,JSON.stringify(db));render()}
function esc(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function view(id,b){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));if(b)b.classList.add('active');render()}
function tag(s){let c=s==='OK'||s==='Erledigt'?'ok':s==='Reparatur'||s==='Offen'||s==='Außer Betrieb'?'bad':s==='Prüfung'||s==='In Arbeit'?'warn':'ok';return '<span class="tag '+c+'">'+esc(s)+'</span>'}
function empty(x){return '<div class="empty">'+x+'</div>'}

let currentDeviceSn='';
function openDeviceDetail(sn){
  currentDeviceSn=sn;
  const d=db.devices.find(x=>x.sn===sn); if(!d)return;
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  document.getElementById('deviceDetail').classList.add('active');
  document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
  document.getElementById('detailTitle').textContent='Lactocorder SN '+d.sn;
  document.getElementById('detailSubtitle').textContent='Rep.-Nr. '+d.rep+' · '+d.loc;
  document.getElementById('deviceInfo').innerHTML='<p><b>Seriennummer:</b> '+esc(d.sn)+'</p><p><b>Rep.-Nr.:</b> '+esc(d.rep)+'</p><p><b>Standort:</b> '+esc(d.loc)+'</p><p><b>Status:</b> '+tag(d.status)+'</p><p><b>Techniker:</b> '+esc(d.tech)+'</p><p><b>Notiz:</b> '+esc(d.note||'')+'</p>';
  const rs=db.repairs.filter(x=>x.sn===sn).slice().reverse();
  const last=rs[0];
  document.getElementById('deviceLastStatus').innerHTML=last?'<p><b>'+tag(last.state)+'</b></p><p>'+esc(last.date)+' · '+esc(last.error)+'</p><p>'+esc(last.action)+'</p>':'<p>Noch keine Reparatur vorhanden.</p>';
  document.getElementById('deviceHistory').innerHTML=rs.length?'<table class="table"><tr><th>Datum</th><th>Rep.</th><th>Fehler</th><th>Maßnahme</th><th>Ersatzteile</th><th>Techniker</th><th>Status</th><th>Aktion</th></tr>'+rs.map(x=>'<tr><td>'+esc(x.date)+'</td><td>'+esc(x.rep)+'</td><td>'+esc(x.error)+'</td><td>'+esc(x.action)+'</td><td>'+esc(x.parts||'')+'</td><td>'+esc(x.tech)+'</td><td>'+tag(x.state)+'</td><td><button class="btn" onclick="editRepair('+x.id+');openDeviceDetail(\''+esc(sn).replace(/'/g,"\\'")+'\')">Bearbeiten</button> <button class="btn" onclick="deleteRepair('+x.id+');openDeviceDetail(\''+esc(sn).replace(/'/g,"\\'")+'\')">Löschen</button></td></tr>').join('')+'</table>':empty('Für dieses Gerät ist noch keine Reparatur eingetragen.');
}

function showDeviceRepairs(sn){
  view('repairs');
  const input=document.getElementById('rs');
  if(input){input.value=sn;input.focus()}
  render();
}

function addDevice(){
  let rep=prompt('Rep.-Nr.');if(rep===null)return;
  let sn=prompt('Seriennummer');if(!sn)return;
  let l=prompt('Standort: Allgäu / Lager / München / Außenstelle','Allgäu')||'Allgäu';
  let st=prompt('Status: OK / Reparatur / Prüfung / Außer Betrieb','OK')||'OK';
  db.devices.push({id:Date.now(),rep:rep,sn:sn,loc:l,status:st,tech:'Rauscher',note:''});save()
}

function addRepair(prefillSn=''){
  if(!db.devices.length)return alert('Bitte zuerst ein Gerät anlegen.');
  let sn=prefillSn||prompt('Seriennummer',db.devices[0].sn);if(!sn)return;
  let d=db.devices.find(x=>x.sn===sn);
  let rep=prompt('Rep.-Nr.',d?.rep||'')||d?.rep||'';
  let date=prompt('Datum (TT.MM.JJJJ)',new Date().toLocaleDateString('de-DE'))||new Date().toLocaleDateString('de-DE');
  let err=prompt('Fehler')||'';
  let act=prompt('Durchgeführte Reparatur / Maßnahme')||'';
  let parts=prompt('Verwendete Ersatzteile')||'';
  let tech=prompt('Techniker','Rauscher')||'Rauscher';
  let state=prompt('Status: Offen / In Arbeit / Erledigt','Offen')||'Offen';
  let note=prompt('Notiz')||'';
  db.repairs.push({id:Date.now(),date,rep,sn,type:'Reparatur',error:err,action:act,parts,tech,state,note});
  if(d&&state!=='Erledigt')d.status='Reparatur';
  save()
}
function editRepair(id){
  let r=db.repairs.find(x=>x.id===id);if(!r)return;
  r.error=prompt('Fehler',r.error)||r.error;
  r.action=prompt('Durchgeführte Reparatur / Maßnahme',r.action)||r.action;
  r.parts=prompt('Verwendete Ersatzteile',r.parts||'')||r.parts||'';
  r.tech=prompt('Techniker',r.tech||'Rauscher')||r.tech;
  r.state=prompt('Status: Offen / In Arbeit / Erledigt',r.state)||r.state;
  r.note=prompt('Notiz',r.note||'')||r.note||'';
  save()
}
function deleteRepair(id){
  if(!confirm('Diese Reparatur wirklich löschen?'))return;
  db.repairs=db.repairs.filter(x=>x.id!==id);save()
}
function addItem(){
  let art=prompt('Artikelnummer');if(!art)return;
  let name=prompt('Bezeichnung');if(!name)return;
  let min=Number(prompt('Mindestbestand je Standort','5'))||0;
  let stock={};loc.forEach(l=>stock[l]=Number(prompt(l+' Bestand','0'))||0);
  db.items.push({art:art,name:name,min:min,stock:stock});save()
}

function render(){
  document.getElementById('nD').textContent=db.devices.length;
  document.getElementById('nR').textContent=db.repairs.filter(x=>x.state!=='Erledigt').length;
  document.getElementById('nI').textContent=db.items.length;
  document.getElementById('nL').textContent=db.items.reduce((n,i)=>n+loc.filter(l=>Number(i.stock[l]||0)<=i.min).length,0);

  document.getElementById('recent').innerHTML=db.repairs.slice(-5).reverse().map(x=>'<div style="padding:9px 0;border-bottom:1px solid #edf0f3"><b>'+esc(x.type)+' · SN '+esc(x.sn)+'</b><div class="muted" style="font-size:11px">'+esc(x.date)+' · '+esc(x.action||x.error)+'</div>'+tag(x.state)+'</div>').join('')||empty('Keine Vorgänge.');

  document.getElementById('locs').innerHTML=loc.map(l=>'<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #edf0f3"><span>'+l+'</span><b>'+db.items.reduce((n,i)=>n+Number(i.stock[l]||0),0)+' Stk.</b></div>').join('');

  let q=(document.getElementById('ds')?.value||'').toLowerCase(),f=document.getElementById('df')?.value||'';
  let ds=db.devices.filter(x=>(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!f||x.status===f));
  document.getElementById('devicesTable').innerHTML=ds.length?
  '<table class="table"><tr><th>Rep.-Nr.</th><th>SN</th><th>Standort</th><th>Status</th><th>Techniker</th><th>Notiz</th><th>Reparaturen</th></tr>'+
  ds.map(x=>{
    const count=db.repairs.filter(r=>r.sn===x.sn).length;
    return '<tr><td><b>'+esc(x.rep)+'</b></td><td>'+esc(x.sn)+'</td><td>'+esc(x.loc)+'</td><td>'+tag(x.status)+'</td><td>'+esc(x.tech)+'</td><td class="muted">'+esc(x.note)+'</td><td><button class="btn" onclick="showDeviceRepairs(\''+esc(x.sn).replace(/'/g,"\\'")+'\')">🔧 '+count+' anzeigen</button></td></tr>'
  }).join('')+'</table>':empty('Keine Geräte.');

  q=(document.getElementById('rs')?.value||'').toLowerCase();
  let rr=db.repairs.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q));
  document.getElementById('repairsTable').innerHTML=rr.length?
  '<table class="table"><tr><th>Datum</th><th>Rep.</th><th>SN</th><th>Art</th><th>Fehler</th><th>Maßnahme / Ergebnis</th><th>Ersatzteile</th><th>Techniker</th><th>Status</th><th>Aktion</th></tr>'+
  rr.slice().reverse().map(x=>'<tr><td>'+esc(x.date)+'</td><td>'+esc(x.rep)+'</td><td><b>'+esc(x.sn)+'</b></td><td>'+esc(x.type)+'</td><td>'+esc(x.error)+'</td><td>'+esc(x.action)+'</td><td>'+esc(x.parts||'')+'</td><td>'+esc(x.tech)+'</td><td>'+tag(x.state)+'</td><td><button class="btn" onclick="editRepair('+x.id+')">Bearbeiten</button> <button class="btn" onclick="deleteRepair('+x.id+')">Löschen</button></td></tr>').join('')+'</table>':empty('Keine Vorgänge.');

  q=(document.getElementById('is')?.value||'').toLowerCase();let lf=document.getElementById('lf')?.value||'';
  let ii=db.items.filter(x=>!q||(x.art+' '+x.name).toLowerCase().includes(q));
  document.getElementById('stockTable').innerHTML=ii.length?
  '<table class="table"><tr><th>Artikel</th><th>Bezeichnung</th><th>Allgäu</th><th>Lager</th><th>München</th><th>Außenstelle</th></tr>'+
  ii.map(x=>'<tr><td><b>'+esc(x.art)+'</b></td><td>'+esc(x.name)+'</td>'+loc.map(l=>{let v=Number(x.stock[l]||0);return '<td>'+((lf&&lf!==l)?'–':'<span class="tag '+(v<=x.min?'bad':'ok')+'">'+v+'</span>')+'</td>'}).join('')+'</tr>').join('')+
  '</table><div class="notice">Rot = am Standort auf/unter Mindestbestand.</div>':empty('Keine Artikel.');

  let h=db.repairs.slice().reverse();
  document.getElementById('historyTable').innerHTML=h.length?
  '<table class="table"><tr><th>Datum</th><th>Typ</th><th>SN</th><th>Rep.</th><th>Fehler</th><th>Maßnahme / Ergebnis</th><th>Techniker</th><th>Status</th></tr>'+
  h.map(x=>'<tr><td>'+esc(x.date)+'</td><td>'+tag(x.type)+'</td><td>'+esc(x.sn)+'</td><td>'+esc(x.rep)+'</td><td>'+esc(x.error)+'</td><td>'+esc(x.action)+'</td><td>'+esc(x.tech)+'</td><td>'+tag(x.state)+'</td></tr>').join('')+
  '</table>':empty('Noch keine Historie.')
}

function exportDB(){
  let a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}));
  a.download='lactocorder-datenbank.json';a.click()
}
render();