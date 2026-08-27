import mongoose from 'mongoose';

export const COMPANY_STATUSES = ['nova', 'analisando', 'site-em-producao', 'site-pronto', 'contato-pendente', 'apresentado', 'cliente', 'recusou'];

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  segment: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 3000, default: '' },
  city: { type: String, trim: true, maxlength: 80, default: '' },
  state: { type: String, trim: true, uppercase: true, maxlength: 2, default: '' },
  address: { type: String, trim: true, maxlength: 240, default: '' },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  whatsapp: { type: String, trim: true, maxlength: 30, default: '' },
  instagram: { type: String, trim: true, maxlength: 200, default: '' },
  facebook: { type: String, trim: true, maxlength: 200, default: '' },
  googleMaps: { type: String, trim: true, maxlength: 500, default: '' },
  businessHours: { type: String, trim: true, maxlength: 1000, default: '' },
  services: [{ type: String, trim: true, maxlength: 160 }],
  products: [{ type: String, trim: true, maxlength: 160 }],
  photos: [{ type: String, trim: true, maxlength: 500 }],
  logo: { type: String, trim: true, maxlength: 500, default: '' },
  notes: { type: String, trim: true, maxlength: 3000, default: '' },
  hasWebsite: { type: Boolean, default: false },
  currentUrl: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: COMPANY_STATUSES, default: 'nova', index: true },
  potential: { type: Number, min: 0, max: 100, default: 0, index: true },
  analysis: { type: mongoose.Schema.Types.Mixed, default: null },
  analyzedAt: { type: Date, default: null },
}, { timestamps: true });

companySchema.index({ name: 'text', segment: 'text', city: 'text' });
export const Company = mongoose.model('Company', companySchema);
