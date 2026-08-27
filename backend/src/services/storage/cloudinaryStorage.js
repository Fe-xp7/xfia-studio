import crypto from 'crypto';
import multer from 'multer';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const cloudinaryImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, done) => allowedTypes.has(file.mimetype)
    ? done(null, true)
    : done(new Error('Envie somente imagens JPG, PNG ou WebP.')),
});

export async function sendToCloudinary(file) {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new AppError('Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.', 503);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'xfia-studio';
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`)
    .digest('hex');
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('api_key', env.cloudinaryApiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.secure_url) {
    throw new AppError(data.error?.message || 'Não foi possível enviar a imagem ao Cloudinary.', 502);
  }
  return { name: file.originalname, size: file.size, mimeType: file.mimetype, url: data.secure_url };
}
