function auth(req){
  const h=req.headers.authorization||'';
  if(!h.startsWith('Bearer '))return null;
  return {token:h.slice(7)};
}
function json(res,status,payload){res.status(status).json(payload)}
export function requireAuth(req,res){
  const a=auth(req);
  if(!a||!a.token){json(res,401,{error:'unauthorized'});return null}
  return a;
}
export function validateSnapshot(x){
  if(!x||typeof x!=='object')return false;
  if(x.schemaVersion!==1||typeof x.deviceId!=='string'||typeof x.updatedAt!=='string'||typeof x.data!=='object')return false;
  return JSON.stringify(x).length<=1000000;
}
export {json};