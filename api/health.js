export default async function handler(req,res){
  const databaseConfigured=Boolean(process.env.FITNESS_DATABASE_URL);
  const authConfigured=Boolean(process.env.FITNESS_AUTH_ISSUER&&process.env.FITNESS_AUTH_JWKS_URL);
  const ready=databaseConfigured&&authConfigured;
  res.status(200).json({
    ok:true,ready,service:'fitness-coach-cloud',version:'v1',
    backendConfigured:databaseConfigured,authConfigured,
    requiredEnvironment:{
      databaseUrl:databaseConfigured,
      authIssuer:Boolean(process.env.FITNESS_AUTH_ISSUER),
      authJwksUrl:Boolean(process.env.FITNESS_AUTH_JWKS_URL)
    }
  });
}
