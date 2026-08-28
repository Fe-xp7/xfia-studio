import crypto from 'crypto';
import { GenerationJob } from '../models/GenerationJob.js';
import { scheduleGenerationJob } from '../services/generationJobs.js';
import { AppError } from '../utils/AppError.js';
import { validateAndPersistImages } from '../services/storage/imagePersistence.js';

export async function createGenerationJob(req, res) {
  const uploaded=await validateAndPersistImages(req,req.files||[]);
  let metadata=[];
  try { metadata=JSON.parse(req.body.imageMetadata||'[]'); } catch { metadata=[]; }
  const photos=uploaded.map((file,index)=>({url:file.url,width:Number(metadata[index]?.width)||0,height:Number(metadata[index]?.height)||0}));
  const heroPhoto=photos.find((photo)=>Math.max(photo.width,photo.height)>=1200&&Math.min(photo.width,photo.height)>=650)?.url||'';
  const input = { businessName: req.body.businessName.trim(), segment: req.body.segment.trim(), description: req.body.description?.trim() || '', whatsapp: req.body.whatsapp.trim(), instagram: req.body.instagram?.trim() || '', photos:photos.map((photo)=>photo.url), heroPhoto };
  const job = await GenerationJob.create({ publicToken: crypto.randomBytes(24).toString('hex'), input, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  scheduleGenerationJob(job._id);
  res.status(202).json({ jobId: job.publicToken, status: job.status, statusUrl: `/api/public/jobs/${job.publicToken}` });
}

export async function getGenerationJob(req, res) {
  const job = await GenerationJob.findOne({ publicToken: req.params.token }).populate('siteId', 'slug status');
  if (!job) throw new AppError('Geração não encontrada ou expirada.', 404);
  const response = { status: job.status, createdAt: job.createdAt, updatedAt: job.updatedAt };
  if (job.status === 'done' && job.siteId) response.result = { siteSlug: job.siteId.slug, previewUrl: `/preview/${job.siteId.slug}` };
  if (job.status === 'failed') response.error = { code: job.errorCode, message: job.errorMessage };
  res.json(response);
}
