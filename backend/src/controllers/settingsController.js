import { Settings } from '../models/Settings.js';
import { env } from '../config/env.js';

const defaults = () => ({
  systemName: 'XFia Studio',
  companyName: 'XFia Studio',
  logoUrl: '',
  defaultCreationFee: env.defaultCreationFee,
  defaultMonthlyFee: env.defaultMonthlyFee,
});

export async function findOrCreateSettings() {
  return Settings.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main', ...defaults() } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

const response = (settings) => ({
  settings,
  integrations: {
    ai: { provider: env.aiProvider, configured: env.aiProvider === 'mock' || Boolean(env.aiApiUrl && env.aiApiKey && env.aiModel) },
    storage: { provider: env.storageProvider, configured: env.storageProvider === 'local' || Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) },
    publication: { provider: env.deploymentProvider, configured: Boolean(env.publicSiteUrl) },
  },
});

export async function getSettings(_req, res) {
  res.json(response(await findOrCreateSettings()));
}

export async function updateSettings(req, res) {
  const allowed = ['systemName', 'companyName', 'logoUrl', 'defaultCreationFee', 'defaultMonthlyFee'];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const settings = await Settings.findOneAndUpdate(
    { key: 'main' },
    { $set: data, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  res.json(response(settings));
}
