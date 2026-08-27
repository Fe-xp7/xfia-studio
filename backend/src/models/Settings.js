import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main' },
  systemName: { type: String, trim: true, maxlength: 80, default: 'XFia Studio' },
  companyName: { type: String, trim: true, maxlength: 120, default: 'XFia Studio' },
  logoUrl: { type: String, trim: true, maxlength: 2000, default: '' },
  defaultCreationFee: { type: Number, min: 0, default: 500 },
  defaultMonthlyFee: { type: Number, min: 0, default: 50 },
}, { timestamps: true });

export const Settings = mongoose.model('Settings', settingsSchema);
