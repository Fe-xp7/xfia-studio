import mongoose from 'mongoose';

export function notFound(req, res) {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  let status = error.statusCode || 500;
  let message = error.message || 'Erro interno do servidor.';
  let details = error.details;
  if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Dados inválidos.';
    details = Object.values(error.errors).map((item) => item.message);
  } else if (error instanceof mongoose.Error.CastError) {
    status = 400;
    message = 'Identificador inválido.';
  } else if (error.code === 11000) {
    status = 409;
    message = 'Já existe um registro com estes dados.';
  } else if (error.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = 'Cada imagem deve ter no máximo 5 MB.';
  } else if (error.code === 'LIMIT_FILE_COUNT') {
    status = 400;
    message = 'Envie no máximo 10 imagens por vez.';
  } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    status = 400;
    message = 'Envie no máximo 5 imagens neste formulário.';
  } else if (error.message === 'Envie somente imagens JPG, PNG ou WebP.') {
    status = 400;
  }
  if (status === 500) console.error(error);
  if (status === 500 && process.env.NODE_ENV === 'production') message = 'Erro interno do servidor.';
  res.status(status).json({ message, ...(details ? { details } : {}) });
}
