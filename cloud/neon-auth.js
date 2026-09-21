/* Fitness Coach - Neon Auth bridge */
(async function(){
  const CONFIG=window.FITNESS_AUTH_CONFIG||{enabled:false};
  const state={client:null,session:null,ready:false};

  function dispatch(){window.dispatchEvent(new CustomEvent('fitness-auth-status',{detail:{signedIn:!!state.session,user:state.session?.user||null}}))}
  function message(text){
    if(typeof window.toast==='function') window.toast(text);
  }
  function addStyles(){
    if(document.getElementById('fitness-auth-style'))return;
    const s=document.createElement('style');s.id='fitness-auth-style';
    s.textContent=`
      .auth-status{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
      .auth-dot{width:9px;height:9px;border-radius:50%;background:#6d7b83}.auth-dot.on{background:#63f59a;box-shadow:0 0 12px rgba(99,245,154,.55)}
      .auth-btn{border:1px solid #344049;background:#172229;color:#fff;border-radius:11px;padding:9px 13px;cursor:pointer}
      .auth-btn.primary{background:#63f59a;color:#06100b;border-color:#63f59a;font-weight:800}
      .auth-back{position:fixed;inset:0;background:rgba(0,0,0,.68);backdrop-filter:blur(9px);z-index:500;display:none;align-items:center;justify-content:center;padding:18px}
      .auth-back.open{display:flex}.auth-box{width:min(430px,100%);background:#111b21;border:1px solid #344049;border-radius:24px;padding:24px;box-shadow:0 25px 70px rgba(0,0,0,.55)}
      .auth-box h2{margin:0 0 6px}.auth-box p{color:#9eabb2;font-size:13px;line-height:1.45}.auth-field{margin-top:12px}.auth-field label{display:block;color:#aebac0;font-size:12px;margin-bottom:5px}.auth-field input{width:100%;background:#0a1217;border:1px solid #344049;color:#fff;border-radius:10px;padding:12px}
      .auth-actions{display:flex;gap:8px;margin-top:16px}.auth-actions button{flex:1}.auth-error{color:#ff7c88;font-size:13px;min-height:18px;margin-top:10px}
    `;
    document.head.appendChild(s);
  }
  function mountUI(){
    addStyles();
    if(document.getElementById('fitnessAuthBack'))return;
    const back=document.createElement('div');back.id='fitnessAuthBack';back.className='auth-back';
    back.innerHTML=`<div class="auth-box">
      <h2 id="authTitle">Fitness Coach anmelden</h2>
      <p id="authModeText">Melde dich an, damit deine Daten geräteübergreifend synchronisiert werden.</p>
      <div class="auth-field"><label>E-Mail</label><input id="authEmail" type="email" autocomplete="email"></div>
      <div class="auth-field"><label>Passwort</label><input id="authPassword" type="password" autocomplete="current-password"></div>
      <div class="auth-field" id="authNameWrap" style="display:none"><label>Name</label><input id="authName" autocomplete="name"></div>
      <div class="auth-error" id="authError"></div>
      <div class="auth-actions"><button class="auth-btn primary" id="authSubmit">Anmelden</button><button class="auth-btn" id="authClose">Schließen</button></div>
      <button class="auth-btn" id="authToggle" style="width:100%;margin-top:9px">Neues Konto erstellen</button>
    </div>`;
    document.body.appendChild(back);
    back.addEventListener('click',e=>{if(e.target===back)back.classList.remove('open')});
    document.getElementById('authClose').onclick=()=>back.classList.remove('open');
    document.getElementById('authToggle').onclick=()=>setMode(mode==='signin'?'signup':'signin');
    document.getElementById('authSubmit').onclick=submit;
  }
  let mode='signin';
  function setMode(next){
    mode=next;
    const signup=mode==='signup';
    document.getElementById('authTitle').textContent=signup?'Konto erstellen':'Fitness Coach anmelden';
    document.getElementById('authModeText').textContent=signup?'Erstelle dein Konto für Cloud-Sync auf deinen Geräten.':'Melde dich an, damit deine Daten geräteübergreifend synchronisiert werden.';
    document.getElementById('authNameWrap').style.display=signup?'block':'none';
    document.getElementById('authSubmit').textContent=signup?'Konto erstellen':'Anmelden';
    document.getElementById('authToggle').textContent=signup?'Zur Anmeldung':'Neues Konto erstellen';
    document.getElementById('authError').textContent='';
  }
  async function submit(){
    const email=document.getElementById('authEmail').value.trim();
    const password=document.getElementById('authPassword').value;
    const name=document.getElementById('authName').value.trim();
    const err=document.getElementById('authError');
    err.textContent='';
    if(!email||password.length<8){err.textContent='Bitte E-Mail und ein Passwort mit mindestens 8 Zeichen eingeben.';return}
    try{
      const result=mode==='signup'
        ?await state.client.signUp.email({email,password,name:name||email.split('@')[0]})
        :await state.client.signIn.email({email,password});
      if(result?.error)throw new Error(result.error.message||'Authentifizierung fehlgeschlagen');
      await refresh();
      document.getElementById('fitnessAuthBack').classList.remove('open');
      message('Anmeldung erfolgreich ✓');
    }catch(e){err.textContent=e?.message||'Anmeldung fehlgeschlagen';}
  }
  function ensureHeader(){
    const top=document.querySelector('.top-inner')||document.querySelector('.top');
    if(!top||document.getElementById('fitnessAuthStatus'))return;
    const box=document.createElement('div');box.id='fitnessAuthStatus';box.className='auth-status';box.style.position='relative';box.style.zIndex='5';
    box.innerHTML='<span class="auth-dot" id="authDot"></span><span id="authLabel">Cloud offline</span><button class="auth-btn" id="authAction">Anmelden</button>';
    top.appendChild(box);
    document.getElementById('authAction').onclick=async()=>state.session?await signOut():document.getElementById('fitnessAuthBack').classList.add('open');
  }
  function render(){
    const dot=document.getElementById('authDot'),label=document.getElementById('authLabel'),action=document.getElementById('authAction');
    if(!dot||!label||!action)return;
    const u=state.session?.user;
    dot.classList.toggle('on',!!u);
    label.textContent=u?'Cloud: '+(u.name||u.email):'Cloud: nicht angemeldet';
    action.textContent=u?'Abmelden':'Anmelden';
  }
  async function refresh(){
    if(!state.client)return;
    try{
      const result=await state.client.getSession();
      state.session=result?.data||result?.session||null;
    }catch{state.session=null}
    render();dispatch();
    if(state.session&&window.FitnessCloud?.flushQueue)window.FitnessCloud.flushQueue().catch(()=>{});
  }
  async function signOut(){
    try{await state.client.signOut();state.session=null;render();dispatch();message('Abgemeldet')}catch(e){message(e?.message||'Abmelden fehlgeschlagen')}
  }
  async function boot(){
    if(!CONFIG.enabled||!CONFIG.authUrl)return;
    mountUI();ensureHeader();
    try{
      const mod=await import('https://cdn.jsdelivr.net/npm/@neondatabase/neon-js/auth/+esm');
      state.client=mod.createAuthClient(CONFIG.authUrl);
      state.ready=true;
      await refresh();
    }catch(e){console.error('Neon Auth:',e);dispatch()}
  }
  window.FitnessAuth={
    status:()=>({ready:state.ready,signedIn:!!state.session,user:state.session?.user||null}),
    getJWTToken:async()=>state.client?.getJWTToken?.()||null,
    open:()=>document.getElementById('fitnessAuthBack')?.classList.add('open'),
    signOut
  };
  window.addEventListener('load',boot);
  window.addEventListener('fitness-cloud-status',render);
})();
