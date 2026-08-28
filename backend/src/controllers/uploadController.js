import { validateAndPersistImages } from '../services/storage/imagePersistence.js';

export async function uploadImages(req,res){
  const files=req.files||[];
  res.status(201).json({files:await validateAndPersistImages(req,files)});
}
