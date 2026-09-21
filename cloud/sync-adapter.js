/* Fitness Coach Cloud Sync Adapter. OFF by default. */
(function(){
  const QUEUE_KEY='fitness_cloud_sync_queue_v1';
  const DEVICE_KEY='fitness_cloud_device_id_v1';
  function deviceId(){
    let id=localStorage.getItem(DEVICE_KEY);
    if(!id){id=(crypto&&crypto.randomUUID?crypto.randomUUID():'device_'+Date.now()+'_'+Math.random().toString(36).slice(2));localStorage.setItem(DEVICE_KEY,id)}
    return id;
  }
  function config(){return window.FITNESS_CLOUD_CONFIG||{enabled:false,apiBaseUrl:''}}
  function queue(){try{const x=JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function saveQueue(x){localStorage.setItem(QUEUE_KEY,JSON.stringify(x.slice(-500)))}
  async function token(){const fn=config().getToken;return typeof fn==='function'?await fn():null}
  async function request(path,options={}){
    const c=config();
    if(!c.enabled||!c.apiBaseUrl)throw new Error('Cloud backend not configured');
    const t=await token();if(!t)throw new Error('Authentication token unavailable');
    const headers=Object.assign({'Content-Type':'application/json','Authorization':'Bearer '+t},options.headers||{});
    const r=await fetch(c.apiBaseUrl.replace(/\/$/,'')+path,Object.assign({},options,{headers}));
    if(!r.ok)throw new Error('Cloud request failed: '+r.status);
    return r.status===204?null:r.json();
  }
  async function syncSnapshot(snapshot){
    const payload={schemaVersion:1,deviceId:deviceId(),updatedAt:new Date().toISOString(),data:snapshot};
    if(!config().enabled){const q=queue();q.push({type:'snapshot',payload,queuedAt:Date.now()});saveQueue(q);return {status:'queued-local',cloudEnabled:false}}
    return request('/v1/sync',{method:'PUT',body:JSON.stringify(payload)});
  }
  async function pullSnapshot(){if(!config().enabled)return {status:'disabled',cloudEnabled:false,snapshot:null};return request('/v1/sync')}
  async function flushQueue(){
    if(!config().enabled)return {sent:0,pending:queue().length};
    const q=queue();let sent=0;
    while(q.length){await request('/v1/sync',{method:'PUT',body:JSON.stringify(q[0].payload)});q.shift();sent++}
    saveQueue(q);return {sent,pending:q.length};
  }
  window.FitnessCloud={status:()=>({enabled:!!config().enabled,configured:!!config().apiBaseUrl,deviceId:deviceId(),pending:queue().length}),syncSnapshot,pullSnapshot,flushQueue,queue:()=>queue().slice()};
})();