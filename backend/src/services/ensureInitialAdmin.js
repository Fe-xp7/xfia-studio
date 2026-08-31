import { Admin } from '../models/Admin.js';

export async function ensureInitialAdmin() {
  if (await Admin.exists({})) return;
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!name || !email || password.length < 12) {
    console.warn('Dashboard sem proprietário: configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres).');
    return;
  }
  await Admin.createWithPassword({ name, email, password });
  console.log('Proprietário inicial do dashboard criado.');
}
