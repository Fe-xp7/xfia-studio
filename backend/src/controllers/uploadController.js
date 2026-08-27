import fs from 'fs/promises';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { persistUploadedFiles } from '../services/storage/index.js';

const validSignature=(buffer)=>buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff
  || buffer.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))
  || buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WEBP';

export async function uploadImages(req,res){
  const files=req.files||[];
  const checks=await Promise.all(files.map(async(file)=>validSignature(
    (file.buffer || await fs.readFile(file.path)).subarray(0,12),
  )));
  if(checks.some(valid=>!valid)){
    if(env.storageProvider==='local') await Promise.all(files.map(file=>fs.unlink(file.path).catch(()=>{})));
    throw new AppError('Um dos arquivos não contém uma imagem JPG, PNG ou WebP válida.',400);
  }
  res.status(201).json({files:await persistUploadedFiles(req,files)});
}
