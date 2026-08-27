import { Template } from '../models/Template.js';
import { AppError } from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';

const clean = (body) => {
  const allowed = ['name','slug','category','description','thumbnail','sections','active','defaultTheme'];
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  data.slug = slugify(data.slug || data.name);
  return data;
};

export async function listTemplates(_req, res) {
  res.json({ items: await Template.find().sort({ category: 1, name: 1 }) });
}
export async function getTemplate(req, res) {
  const item = await Template.findById(req.params.id);
  if (!item) throw new AppError('Template não encontrado.', 404);
  res.json(item);
}
export async function createTemplate(req, res) {
  res.status(201).json(await Template.create(clean(req.body)));
}
export async function updateTemplate(req, res) {
  const item = await Template.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true });
  if (!item) throw new AppError('Template não encontrado.', 404);
  res.json(item);
}
export async function deleteTemplate(req, res) {
  const item = await Template.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Template não encontrado.', 404);
  res.status(204).end();
}
