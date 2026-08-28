import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnv } from './config/env.js';
import { ensureDefaultTemplates } from './services/templateSeeder.js';
import { recoverGenerationJobs } from './services/generationJobs.js';
import { recoverBillingJobs, runBillingLifecycle } from './services/billing/billingJobs.js';

async function start() {
  validateEnv();
  await connectDatabase();
  await ensureDefaultTemplates();
  await recoverGenerationJobs();
  await recoverBillingJobs();
  setInterval(()=>runBillingLifecycle().catch((error)=>console.error('Falha na manutenção de billing:',error)),6*60*60*1000).unref();
  app.listen(env.port, () => console.log(`API disponível em http://localhost:${env.port}`));
}

start().catch((error) => { console.error('Falha ao iniciar a API:', error.message); process.exit(1); });
