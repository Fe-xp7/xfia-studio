import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Autenticação necessária.', 401);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    if (!admin) throw new Error('Admin inexistente');
    req.admin = admin;
    next();
  } catch {
    throw new AppError('Sessão inválida ou expirada.', 401);
  }
});
