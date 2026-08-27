import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { localImageUpload } from './localStorage.js';
import { cloudinaryImageUpload, sendToCloudinary } from './cloudinaryStorage.js';

const uploaders = { local: localImageUpload, cloudinary: cloudinaryImageUpload };

export const imageUpload = uploaders[env.storageProvider];
if (!imageUpload) throw new Error(`STORAGE_PROVIDER desconhecido: ${env.storageProvider}`);

export async function persistUploadedFiles(req, files) {
  if (env.storageProvider === 'cloudinary') return Promise.all(files.map(sendToCloudinary));
  if (env.storageProvider === 'local') {
    const base = `${req.protocol}://${req.get('host')}`;
    return files.map((file) => ({
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `${base}/uploads/${file.filename}`,
    }));
  }
  throw new AppError('Armazenamento de imagens indisponível.', 503);
}
