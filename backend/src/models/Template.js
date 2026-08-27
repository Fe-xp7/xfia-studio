import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  thumbnail: { type: String, trim: true, maxlength: 500, default: '' },
  sections: [{ type: String, trim: true }],
  active: { type: Boolean, default: true, index: true },
  defaultTheme: {
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#0f172a' },
    fontFamily: { type: String, default: 'Inter' },
  },
}, { timestamps: true });

export const Template = mongoose.model('Template', templateSchema);
