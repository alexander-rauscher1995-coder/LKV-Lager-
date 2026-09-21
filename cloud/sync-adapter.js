/* Fitness Coach Cloud Sync Adapter. OFF by default. */
(function(){
  const QUEUE_KEY='fitness_cloud_sync_queue_v1';
  const DEVICE_KEY='fitness_cloud_device_id_v1';
  const REVISION_KEY='fitness_cloud_revision_v1';
  const MAX_QUEUE=50;

  function deviceId(){
    let id=localStorage.getItem(DEVICE_KEY);
    if(!id){
      id=(crypto&&crypto.randomUUID?crypto.randomUUID():'device_'+Date.now()+'_'+Math.random().toString(36).slice(2));
      localStorage.setItem(DEVICE_KEY,id);
    }
    return id;
  }
  function revision(){return Number(localStorage.getItem(REVISION_KEY)||0)||0}
  function saveRevision(value){if(Number.isFinite(Number(value)))localStorage.setItem(REVISION_KEY,String(value))}
  function config(){return window.FITNESS_CLOUD_CONFIG||{enabled:false,apiBaseUrl:''}}
  function queue(){try{const x=JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function saveQueue(x){localStorage.setItem(QUEUE_KEY,JSON.stringify(x.slice(-MAX_QUEUE)))}
  function enqueue(payload){
    const q=queue();
    const filtered=q.filter(x=>x?.payload?.deviceId!==payload.deviceId);
    filtered.push({payload,queuedAt:new Date().toISOString()});
    saveQueue(filtered);
    return filtered.length;
  }
  async function token(){const fn=config().getToken;return typeof fn==='function'?await fn():null}
  async function request(path,options={}){
    const c=config();
    if(!c.enabled||!c.apiBaseUrl)throw new Error('Cloud backend not configured');
    const t=await token();if(!t)throw new Error('Authentication token unavailable');
    const headers=Object.assign({'Content-Type':'application/json','Authorization':'Bearer '+t},options.headers||{});
    const r=await fetch(c.apiBaseUrl.replace(/\/$/,'')+path,Object.assign({},options,{headers}));
    const body=r.status===204?null:await r.json().catch(()=>null);
    if(!r.ok){
      const error=new Error('Cloud request failed: '+r.status);
      error.status=r.status;error.body=body;
      throw error;
    }
    return body;
  }
  function normalizeSnapshot(input){
    const now=new Date().toISOString();
    if(input&&input.schemaVersion===1&&input.data&&typeof input.data==='object'){
      return Object.assign({},input,{
        schemaVersion:1,
        deviceId:input.deviceId||deviceId(),
        updatedAt:input.updatedAt||now,
        baseRevision:revision()
      });
    }
    return {schemaVersion:1,deviceId:deviceId(),updatedAt:now,baseRevision:revision(),data:input||{}};
  }
  async function syncSnapshot(snapshot){
    const payload=normalizeSnapshot(snapshot);
    if(!config().enabled)return {status:'disabled',cloudEnabled:false,queued:false,pending:queue().length};
    try{
      const result=await request('/v1/sync',{method:'PUT',body:JSON.stringify(payload)});
      if(Number.isFinite(Number(result?.revision)))saveRevision(result.revision);
      return Object.assign({},result||{},{status:'synced',queued:false,pending:queue().length});
    }catch(error){
      const pending=enqueue(payload);
      window.dispatchEvent(new CustomEvent('fitness-cloud-status'));
      return {status:'queued',queued:true,pending,error:String(error?.message||error),httpStatus:error?.status||0};
    }
  }
  async function pullSnapshot(){
    if(!config().enabled)return {status:'disabled',cloudEnabled:false,snapshot:null};
    const result=await request('/v1/sync');
    if(Number.isFinite(Number(result?.revision)))saveRevision(result.revision);
    return result;
  }
  async function flushQueue(){
    if(!config().enabled)return {sent:0,pending:queue().length};
    const q=queue();let sent=0;
    while(q.length){
      try{
        const result=await request('/v1/sync',{method:'PUT',body:JSON.stringify(q[0].payload)});
        if(Number.isFinite(Number(result?.revision)))saveRevision(result.revision);
        q.shift();sent++;
      }catch(error){
        saveQueue(q);
        window.dispatchEvent(new CustomEvent('fitness-cloud-status'));
        return {sent,pending:q.length,error:String(error?.message||error),httpStatus:error?.status||0};
      }
    }
    saveQueue(q);
    window.dispatchEvent(new CustomEvent('fitness-cloud-status'));
    return {sent,pending:q.length};
  }
  window.FitnessCloud={
    status:()=>({enabled:!!config().enabled,configured:!!config().apiBaseUrl,deviceId:deviceId(),revision:revision(),pending:queue().length}),
    syncSnapshot,pullSnapshot,flushQueue,queue:()=>queue().slice()
  };
  window.addEventListener('online',()=>{flushQueue().catch(()=>{})});
  window.addEventListener('load',()=>{if(navigator.onLine)flushQueue().catch(()=>{})});
})();