import {requireAuth,writeUserChanges,json} from '../../../_lib/sync.js';

export default async function handler(req,res){
  const auth=await requireAuth(req,res); if(!auth)return;
  if(req.method!=='POST')return json(res,405,{error:'method_not_allowed'});
  if(!globalThis.FITNESS_PERSISTENCE && !process.env.FITNESS_DATABASE_URL)return json(res,503,{error:'persistence_not_configured'});

  const changes=req.body?.changes;
  if(!Array.isArray(changes)||changes.length>500)return json(res,400,{error:'invalid_changes'});
  const result=await writeUserChanges(auth.subject,changes);
  if(!result)return json(res,503,{error:'persistence_not_configured'});
  if(result.conflicts?.length)return json(res,409,{status:'conflict',revision:result.revision??null,conflicts:result.conflicts});
  return json(res,200,{status:'ok',revision:result.revision??null,conflicts:[]});
}
