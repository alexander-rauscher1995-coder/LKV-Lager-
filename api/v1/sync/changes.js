import {requireAuth,json} from '../../../_lib/sync.js';

export default async function handler(req,res){
  const auth=requireAuth(req,res); if(!auth)return;
  if(req.method!=='POST')return json(res,405,{error:'method_not_allowed'});
  return json(res,501,{error:'database_not_configured',message:'Configure the production persistence adapter before enabling cloud sync.'});
}