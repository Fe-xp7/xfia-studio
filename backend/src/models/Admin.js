import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });

adminSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminSchema.statics.createWithPassword = async function createWithPassword(data) {
  return this.create({ ...data, passwordHash: await bcrypt.hash(data.password, 12) });
};

export const Admin = mongoose.model('Admin', adminSchema);
