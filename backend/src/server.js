import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnv } from './config/env.js';
import { ensureDefaultTemplates } from './services/templateSeeder.js';

async function start() {
  validateEnv();
  await connectDatabase();
  await ensureDefaultTemplates();
  app.listen(env.port, () => console.log(`API disponível em http://localhost:${env.port}`));
}

start().catch((error) => { console.error('Falha ao iniciar a API:', error.message); process.exit(1); });
