import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { validateEnv } from '../config/env.js';
import { Admin } from '../models/Admin.js';

async function seed() {
  validateEnv();
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) throw new Error('Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 8 caracteres).');
  await connectDatabase();
  await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase() }, { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) }, { upsert: true, runValidators: true });
  console.log('Administrador criado/atualizado com segurança.');
  process.exit(0);
}
seed().catch((error) => { console.error(error.message); process.exit(1); });
