import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  theme: { type: mongoose.Schema.Types.Mixed, default: {} },
  seo: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['rascunho', 'pronto', 'publicado', 'arquivado'], default: 'rascunho', index: true },
  previewUrl: { type: String, default: '' },
  productionUrl: { type: String, default: '' },
  deploymentId: { type: String, default: '' },
}, { timestamps: true });

export const Site = mongoose.model('Site', siteSchema);
