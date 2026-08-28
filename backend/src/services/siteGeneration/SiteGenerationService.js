import { Site } from '../../models/Site.js';
import { Template } from '../../models/Template.js';
import { AppError } from '../../utils/AppError.js';
import { slugify } from '../../utils/slugify.js';
import { aiService } from '../ai/index.js';

async function uniqueSlug(company) {
  const base = slugify(company.name) || `site-${company.id}`;
  const existing = await Site.findOne({ slug: base, companyId: { $ne: company._id } });
  return existing ? `${base}-${company.id.toString().slice(-6)}` : base;
}

export async function analyzeCompanyForSite(company) {
  const templates = await Template.find({ active: true }).select('name slug category sections defaultTheme');
  const analysis = await aiService.analyze(company, templates);
  company.analysis = analysis;
  company.analyzedAt = new Date();
  company.potential = analysis.potentialScore;
  company.status = 'site-em-producao';
  await company.save();
  return analysis;
}

export async function generateSiteForCompany(company) {
  if (!company.analysis) throw new AppError('Analise a empresa antes de gerar o site.', 409);
  const template = await Template.findOne({ slug: company.analysis.recommendedTemplate, active: true })
    || await Template.findOne({ active: true }).sort({ createdAt: 1 });
  if (!template) throw new AppError('Cadastre ao menos um template ativo antes de gerar o site.', 409);
  const generated = await aiService.generateContent(company, company.analysis);
  const slug = await uniqueSlug(company);
  const site = await Site.findOneAndUpdate(
    { companyId: company._id, status: { $ne: 'arquivado' } },
    { companyId: company._id, templateId: template._id, name: `Site ${company.name}`, slug, content: generated, theme: { ...template.defaultTheme?.toObject?.(), mode: 'light', colors: company.analysis.recommendedColors, style: company.analysis.recommendedStyle }, seo: generated.seo, status: 'rascunho' },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  company.status = 'site-pronto';
  await company.save();
  return site;
}

export async function runFullSiteGeneration(company) {
  if (!company.analysis) await analyzeCompanyForSite(company);
  return generateSiteForCompany(company);
}
