/* Fitness Coach local snapshot bridge for the cloud adapter. */
(function(){
  const KEYS=[
    'fitness_coach_setup','fitness_v85_training_data','fitness_v85_sessions',
    'fitness_v98_cardio','fitness_v98_nutrition','fitness_custom_plans_v1',
    'fitness_coach_way','fitness_body_check','fitness_app_settings'
  ];
  function snapshot(){
    const data={};
    KEYS.forEach(k=>{try{const raw=localStorage.getItem(k);if(raw!==null)data[k]=JSON.parse(raw)}catch{data[k]=localStorage.getItem(k)}});
    return {schemaVersion:1,capturedAt:new Date().toISOString(),data};
  }
  async function queueSnapshot(){
    if(!window.FitnessCloud)return {status:'adapter-missing'};
    return window.FitnessCloud.syncSnapshot(snapshot());
  }
  window.FitnessCoachCloudSnapshot={snapshot,queueSnapshot};
})();