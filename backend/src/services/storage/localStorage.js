import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

export const uploadsDirectory=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../uploads');
const extensions={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp'};
const storage=multer.diskStorage({destination:uploadsDirectory,filename:(_req,file,done)=>done(null,`${Date.now()}-${crypto.randomUUID()}${extensions[file.mimetype]||''}`)});
export const localImageUpload=multer({storage,limits:{fileSize:5*1024*1024,files:10},fileFilter:(_req,file,done)=>extensions[file.mimetype]?done(null,true):done(new Error('Envie somente imagens JPG, PNG ou WebP.'))});
