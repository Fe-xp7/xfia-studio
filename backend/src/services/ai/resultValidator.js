import { AppError } from '../../utils/AppError.js';

const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
export function validateAnalysis(value) {
  const valid = value && Number.isFinite(Number(value.potentialScore)) && typeof value.recommendedTemplate === 'string'
    && typeof value.recommendedStyle === 'string' && strings(value.recommendedColors)
    && strings(value.recommendedSections) && typeof value.mainCTA === 'string'
    && typeof value.businessDescription === 'string' && strings(value.recommendations) && strings(value.salesArguments);
  if (!valid) throw new AppError('A análise da IA não seguiu a estrutura esperada.', 502);
  return { ...value, potentialScore:Math.max(0,Math.min(100,Math.round(Number(value.potentialScore)))), recommendedColors:value.recommendedColors.slice(0,4), recommendedSections:value.recommendedSections.slice(0,12), recommendations:value.recommendations.slice(0,8), salesArguments:value.salesArguments.slice(0,8) };
}

export function validateContent(value) {
  const required=['hero','about','services','differentiators','cta','location','hours','contact','footer','seo'];
  if (!value || required.some((key)=>value[key]===undefined) || !Array.isArray(value.services) || !Array.isArray(value.differentiators)) throw new AppError('O conteúdo da IA não seguiu a estrutura esperada.',502);
  return value;
}
