/* Fitness Coach local snapshot bridge for the cloud adapter. */
(function(){
  const KEYS=[
    'fitness_coach_setup','fitness_v85_training_data','fitness_v85_sessions',
    'fitness_v98_cardio','fitness_v98_nutrition','fitness_custom_plans_v1',
    'fitness_coach_way','fitness_body_check','fitness_app_settings'
  ];
  const DEVICE_KEY='fitness_cloud_device_id_v1';

  function deviceId(){
    try{
      let id=localStorage.getItem(DEVICE_KEY);
      if(!id){
        id=(crypto?.randomUUID?.()||('device-'+Date.now()+'-'+Math.random().toString(36).slice(2)));
        localStorage.setItem(DEVICE_KEY,id);
      }
      return id;
    }catch{
      return 'device-fallback';
    }
  }

  function snapshot(){
    const data={};
    KEYS.forEach(k=>{
      try{
        const raw=localStorage.getItem(k);
        if(raw!==null)data[k]=JSON.parse(raw);
      }catch{
        data[k]=localStorage.getItem(k);
      }
    });
    const now=new Date().toISOString();
    return {schemaVersion:1,deviceId:deviceId(),updatedAt:now,capturedAt:now,data};
  }

  function validateSnapshot(x){
    return !!(x&&x.schemaVersion===1&&typeof x.deviceId==='string'&&x.deviceId.length>=8&&typeof x.updatedAt==='string'&&x.data&&typeof x.data==='object'&&!Array.isArray(x.data));
  }

  async function queueSnapshot(){
    if(!window.FitnessCloud)return {status:'adapter-missing'};
    const value=snapshot();
    if(!validateSnapshot(value))return {status:'rejected',error:'Invalid local snapshot'};
    return window.FitnessCloud.syncSnapshot(value);
  }

  window.FitnessCoachCloudSnapshot={snapshot,queueSnapshot,validateSnapshot};
})();