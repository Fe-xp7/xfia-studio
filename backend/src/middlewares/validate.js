import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  const errors = schema(req.body);
  if (errors.length) return next(new AppError('Dados inválidos.', 400, errors));
  next();
};
