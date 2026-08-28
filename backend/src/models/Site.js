import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  theme: { type: mongoose.Schema.Types.Mixed, default: {} },
  seo: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['rascunho', 'pronto', 'publicado', 'suspenso', 'arquivado'], default: 'rascunho', index: true },
  previewUrl: { type: String, default: '' },
  productionUrl: { type: String, default: '' },
  deploymentId: { type: String, default: '' },
  publication: {
    subdomain: { type: String, trim: true, lowercase: true },
    version: { type: Number, default: 0, min: 0 },
    publishedAt: { type: Date, default: null },
  },
  domains: [{
    hostname: { type: String, trim: true, lowercase: true },
    status: { type: String, enum: ['pending', 'verifying', 'active', 'failed'], default: 'pending' },
    verificationToken: { type: String, default: '', select: false },
    providerId: { type: String, default: '' },
  }],
}, { timestamps: true });

siteSchema.index(
  { 'publication.subdomain': 1 },
  { unique: true, partialFilterExpression: { 'publication.subdomain': { $type: 'string' } } },
);
siteSchema.index({ 'domains.hostname': 1 }, { unique: true, sparse: true });

export const Site = mongoose.model('Site', siteSchema);
