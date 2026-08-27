import { Company } from '../models/Company.js';
import { AppError } from '../utils/AppError.js';
import { Template } from '../models/Template.js';
import { Site } from '../models/Site.js';
import { aiService } from '../services/ai/index.js';
import { slugify } from '../utils/slugify.js';

const clean = (body) => {
  const allowed = ['name','segment','description','city','state','address','phone','whatsapp','instagram','facebook','googleMaps','businessHours','services','products','photos','logo','notes','hasWebsite','currentUrl','status','potential'];
  return Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
};

export async function listCompanies(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.$text = { $search: req.query.search };
  const [items, total] = await Promise.all([
    Company.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Company.countDocuments(filter),
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getCompany(req, res) {
  const item = await Company.findById(req.params.id);
  if (!item) throw new AppError('Empresa não encontrada.', 404);
  res.json(item);
}

export async function createCompany(req, res) {
  res.status(201).json(await Company.create(clean(req.body)));
}

export async function updateCompany(req, res) {
  const item = await Company.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true });
  if (!item) throw new AppError('Empresa não encontrada.', 404);
  res.json(item);
}

export async function deleteCompany(req, res) {
  const item = await Company.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Empresa não encontrada.', 404);
  res.status(204).end();
}

export async function analyzeCompany(req, res) {
  const company = await Company.findById(req.params.id);
  if (!company) throw new AppError('Empresa não encontrada.', 404);
  const previousStatus = company.status;
  company.status = 'analisando';
  await company.save();
  try {
    const templates = await Template.find({ active:true }).select('name slug category sections defaultTheme');
    const analysis = await aiService.analyze(company, templates);
    company.analysis = analysis;
    company.analyzedAt = new Date();
    company.potential = analysis.potentialScore;
    company.status = 'site-em-producao';
    await company.save();
    res.json({ analysis, company });
  } catch (error) {
    company.status = previousStatus;
    await company.save();
    throw error;
  }
}

async function uniqueSlug(company) {
  const base=slugify(company.name)||`site-${company.id}`;
  const existing=await Site.findOne({ slug:base, companyId:{ $ne:company._id } });
  return existing ? `${base}-${company.id.toString().slice(-6)}` : base;
}

export async function generateCompanySite(req, res) {
  const company=await Company.findById(req.params.id);
  if(!company) throw new AppError('Empresa não encontrada.',404);
  if(!company.analysis) throw new AppError('Analise a empresa antes de gerar o site.',409);
  const template=await Template.findOne({slug:company.analysis.recommendedTemplate,active:true}) || await Template.findOne({active:true}).sort({createdAt:1});
  if(!template) throw new AppError('Cadastre ao menos um template ativo antes de gerar o site.',409);
  const generated=await aiService.generateContent(company,company.analysis);
  const slug=await uniqueSlug(company);
  const site=await Site.findOneAndUpdate({companyId:company._id,status:{$ne:'arquivado'}},{companyId:company._id,templateId:template._id,name:`Site ${company.name}`,slug,content:generated,theme:{...template.defaultTheme?.toObject?.(),mode:'light',colors:company.analysis.recommendedColors,style:company.analysis.recommendedStyle},seo:generated.seo,status:'rascunho'},{new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});
  company.status='site-pronto';
  await company.save();
  res.status(201).json({site,company});
}
