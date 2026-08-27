import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { analysisPrompt, contentPrompt } from './prompts.js';
import { HttpAIProvider } from './httpProvider.js';
import { MockAIProvider } from './mockProvider.js';
import { validateAnalysis, validateContent } from './resultValidator.js';

const provider = env.aiProvider === 'mock' ? new MockAIProvider() : env.aiProvider === 'http'
  ? new HttpAIProvider({ apiUrl:env.aiApiUrl, apiKey:env.aiApiKey, model:env.aiModel }) : null;

export const aiService = {
  async analyze(company, templates) {
    if (!provider) throw new AppError(`Provedor de IA desconhecido: ${env.aiProvider}`, 503);
    return validateAnalysis(await provider.analyze(company, templates, analysisPrompt(company, templates)));
  },
  async generateContent(company, analysis) {
    if (!provider) throw new AppError(`Provedor de IA desconhecido: ${env.aiProvider}`, 503);
    return validateContent(await provider.generateContent(company, analysis, contentPrompt(company, analysis)));
  },
};
