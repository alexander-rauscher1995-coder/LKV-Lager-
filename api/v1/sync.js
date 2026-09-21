import {requireAuth,validateSnapshot,readUserSnapshot,writeUserSnapshot,json} from '../../_lib/sync.js';

export default async function handler(req,res){
  const auth=requireAuth(req,res); if(!auth)return;
  const persistence=globalThis.FITNESS_PERSISTENCE;
  if(!persistence)return json(res,503,{error:'persistence_not_configured'});

  if(req.method==='GET'){
    const snapshot=await readUserSnapshot(auth.subject);
    return json(res,200,{status:'ok',revision:snapshot?.revision??null,snapshot:snapshot?.snapshot??null});
  }

  if(req.method==='PUT'){
    if(!validateSnapshot(req.body))return json(res,400,{error:'invalid_snapshot'});
    const result=await writeUserSnapshot(auth.subject,req.body);
    if(!result)return json(res,503,{error:'persistence_not_configured'});
    return json(res,200,{status:'ok',revision:result.revision??null,conflicts:result.conflicts||[]});
  }

  return json(res,405,{error:'method_not_allowed'});
}
