import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET deve ter ao menos 32 caracteres.');
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((value)=>value.trim().replace(/\/$/,'')).filter(Boolean),
  aiProvider: process.env.AI_PROVIDER || 'mock',
  aiApiUrl: process.env.AI_API_URL || '',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || '',
  deploymentProvider: process.env.DEPLOYMENT_PROVIDER || 'local',
  publicSiteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
  defaultCreationFee: Number(process.env.DEFAULT_CREATION_FEE) || 500,
  defaultMonthlyFee: Number(process.env.DEFAULT_MONTHLY_FEE) || 50,
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
