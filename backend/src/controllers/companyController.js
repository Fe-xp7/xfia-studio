import { Company } from '../models/Company.js';
import { AppError } from '../utils/AppError.js';
import { analyzeCompanyForSite, generateSiteForCompany } from '../services/siteGeneration/SiteGenerationService.js';

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
    const analysis = await analyzeCompanyForSite(company);
    res.json({ analysis, company });
  } catch (error) {
    company.status = previousStatus;
    await company.save();
    throw error;
  }
}

export async function generateCompanySite(req, res) {
  const company=await Company.findById(req.params.id);
  if(!company) throw new AppError('Empresa não encontrada.',404);
  const site=await generateSiteForCompany(company);
  res.status(201).json({site,company});
}
