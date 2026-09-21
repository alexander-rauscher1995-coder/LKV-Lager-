import {requireAuth,validateSnapshot,json} from '../../_lib/sync.js';

export default async function handler(req,res){
  const auth=requireAuth(req,res); if(!auth)return;
  if(req.method==='GET'){
    return json(res,200,{status:'backend-ready',revision:null,snapshot:null});
  }
  if(req.method==='PUT'){
    if(!validateSnapshot(req.body))return json(res,400,{error:'invalid_snapshot'});
    return json(res,501,{error:'database_not_configured',message:'Configure the production persistence adapter before enabling cloud sync.'});
  }
  return json(res,405,{error:'method_not_allowed'});
}