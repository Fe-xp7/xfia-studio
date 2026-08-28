import mongoose from 'mongoose';

const generationJobSchema = new mongoose.Schema({
  publicToken: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending', index: true },
  input: { type: mongoose.Schema.Types.Mixed, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', default: null },
  errorCode: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  attempts: { type: Number, default: 0, min: 0 },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

export const GenerationJob = mongoose.model('GenerationJob', generationJobSchema);
