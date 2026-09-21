import pg from 'pg';

const {Pool}=pg;
let pool=null;

function getPool(){
  if(!process.env.FITNESS_DATABASE_URL)return null;
  if(!pool){
    pool=new Pool({
      connectionString:process.env.FITNESS_DATABASE_URL,
      max:Number(process.env.FITNESS_DATABASE_POOL_MAX||5),
      ssl:process.env.FITNESS_DATABASE_SSL==='false'?false:{rejectUnauthorized:true}
    });
  }
  return pool;
}

export async function getSnapshot(userId){
  const db=getPool(); if(!db)return null;
  const result=await db.query('select revision, device_id, updated_at, snapshot from fitness_snapshots where user_id=$1',[userId]);
  const row=result.rows[0];
  return row?{revision:Number(row.revision),deviceId:row.device_id,updatedAt:row.updated_at,snapshot:row.snapshot}:null;
}

export async function putSnapshot(userId,snapshot){
  const db=getPool(); if(!db)return null;
  const client=await db.connect();
  try{
    await client.query('begin');
    const current=(await client.query('select revision, snapshot from fitness_snapshots where user_id=$1 for update',[userId])).rows[0];
    const base=Number(snapshot.baseRevision||0);
    const currentRevision=Number(current?.revision||0);
    if(current && base!==currentRevision){
      await client.query('rollback');
      return {revision:currentRevision,conflicts:[{type:'revision-conflict',expected:base,actual:currentRevision}]};
    }
    const next=currentRevision+1;
    await client.query('insert into fitness_snapshots (user_id,revision,device_id,updated_at,snapshot,updated_server_at) values($1,$2,$3,$4,$5::jsonb,now()) on conflict(user_id) do update set revision=excluded.revision,device_id=excluded.device_id,updated_at=excluded.updated_at,snapshot=excluded.snapshot,updated_server_at=now()',[userId,next,snapshot.deviceId,new Date(snapshot.updatedAt),JSON.stringify(snapshot)]);
    await client.query('commit');
    return {revision:next,conflicts:[]};
  }catch(error){await client.query('rollback').catch(()=>{});throw error}
  finally{client.release()}
}

export async function appendChanges(userId,changes){
  const db=getPool(); if(!db)return null;
  const client=await db.connect();
  try{
    await client.query('begin');
    const current=(await client.query('select revision from fitness_snapshots where user_id=$1 for update',[userId])).rows[0];
    const currentRevision=Number(current?.revision||0);
    const requestedBase=Number(changes?.[0]?.baseRevision||currentRevision);
    if(requestedBase!==currentRevision){
      await client.query('rollback');
      return {revision:currentRevision,conflicts:[{type:'revision-conflict',expected:requestedBase,actual:currentRevision}]};
    }
    const next=currentRevision+1;
    await client.query('insert into fitness_changes(user_id,revision,device_id,changed_at,changes) values($1,$2,$3,$4,$5::jsonb)',[userId,next,String(changes?.[0]?.deviceId||'unknown'),new Date(),JSON.stringify(changes)]);
    await client.query('commit');
    return {revision:next,conflicts:[]};
  }catch(error){await client.query('rollback').catch(()=>{});throw error}
  finally{client.release()}
}

export default {getSnapshot,putSnapshot,appendChanges};