import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';

export async function login(req, res) {
  res.set('Cache-Control','private, no-store');
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!admin || !(await admin.comparePassword(password))) throw new AppError('E-mail ou senha inválidos.', 401);
  const token = jwt.sign({ sub: admin.id, role: 'admin' }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}

export function me(req, res) {
  res.set('Cache-Control','private, no-store');
  res.json({ id: req.admin.id, name: req.admin.name, email: req.admin.email });
}
