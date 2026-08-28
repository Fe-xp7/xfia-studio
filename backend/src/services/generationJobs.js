import { Company } from '../models/Company.js';
import { GenerationJob } from '../models/GenerationJob.js';
import { Site } from '../models/Site.js';
import { runFullSiteGeneration } from './siteGeneration/SiteGenerationService.js';

export async function processGenerationJob(jobId) {
  const job = await GenerationJob.findOneAndUpdate(
    { _id: jobId, status: 'pending' },
    { $set: { status: 'processing', startedAt: new Date(), errorCode: '', errorMessage: '' }, $inc: { attempts: 1 } },
    { new: true },
  );
  if (!job) return;
  try {
    let company = job.companyId ? await Company.findById(job.companyId) : null;
    if (!company) {
      company = await Company.create({ name: job.input.businessName, segment: job.input.segment, description: job.input.description, whatsapp: job.input.whatsapp, instagram: job.input.instagram, photos: job.input.photos||[] });
      job.companyId = company._id;
      await job.save();
    }
    const site = await runFullSiteGeneration(company);
    if(job.input.heroPhoto&&!site.content?.hero?.image)await Site.updateOne({_id:site._id},{$set:{'content.hero.image':job.input.heroPhoto}});
    await GenerationJob.updateOne({ _id: job._id }, { $set: { status: 'done', siteId: site._id, companyId: company._id, completedAt: new Date() } });
  } catch (error) {
    console.error(`Falha no job de geração ${job._id}:`, error);
    await GenerationJob.updateOne({ _id: job._id }, { $set: { status: 'failed', errorCode: 'GENERATION_FAILED', errorMessage: 'Não foi possível gerar o site. Tente novamente.', completedAt: new Date() } });
  }
}

export function scheduleGenerationJob(jobId) {
  setImmediate(() => processGenerationJob(jobId).catch((error) => console.error('Falha ao iniciar job de geração:', error)));
}

export async function recoverGenerationJobs() {
  const stale = new Date(Date.now() - 5 * 60 * 1000);
  await GenerationJob.updateMany({ status: 'processing', startedAt: { $lt: stale }, attempts: { $lt: 3 } }, { $set: { status: 'pending' } });
  const pending = await GenerationJob.find({ status: 'pending', attempts: { $lt: 3 } }).select('_id').limit(50);
  pending.forEach((job) => scheduleGenerationJob(job._id));
}
