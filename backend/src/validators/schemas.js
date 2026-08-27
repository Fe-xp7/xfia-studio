const isString = (value) => typeof value === 'string';
const allowedCompanyStatuses = ['nova', 'analisando', 'site-em-producao', 'site-pronto', 'contato-pendente', 'apresentado', 'cliente', 'recusou'];

export function loginSchema(body) {
  const errors = [];
  if (!isString(body.email) || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('Informe um e-mail válido.');
  if (!isString(body.password) || body.password.length < 8) errors.push('A senha deve ter pelo menos 8 caracteres.');
  return errors;
}

export function companySchema(body) {
  const errors = [];
  if (!isString(body.name) || body.name.trim().length < 2) errors.push('Nome deve ter pelo menos 2 caracteres.');
  if (!isString(body.segment) || body.segment.trim().length < 2) errors.push('Segmento é obrigatório.');
  if (body.state && (!isString(body.state) || body.state.trim().length !== 2)) errors.push('Estado deve usar a sigla com 2 letras.');
  if (body.potential !== undefined && (!Number.isFinite(Number(body.potential)) || Number(body.potential) < 0 || Number(body.potential) > 100)) errors.push('Potencial deve estar entre 0 e 100.');
  if (body.status && !allowedCompanyStatuses.includes(body.status)) errors.push('Status da empresa inválido.');
  return errors;
}

export function templateSchema(body) {
  const errors = [];
  if (!isString(body.name) || body.name.trim().length < 2) errors.push('Nome é obrigatório.');
  if (!isString(body.category) || body.category.trim().length < 2) errors.push('Categoria é obrigatória.');
  if (body.sections && !Array.isArray(body.sections)) errors.push('Seções devem ser uma lista.');
  return errors;
}

export function clientSchema(body) {
  const errors=[];
  if(body.companyId!==undefined&&(!isString(body.companyId)||!body.companyId))errors.push('Empresa é obrigatória.');
  for(const key of ['creationFee','monthlyFee'])if(body[key]!==undefined&&(!Number.isFinite(Number(body[key]))||Number(body[key])<0))errors.push(`${key} deve ser um valor positivo.`);
  if(body.status&&!['ativo','inativo','cancelado'].includes(body.status))errors.push('Status do cliente inválido.');
  return errors;
}
export function subscriptionSchema(body) {
  const errors=[];
  if(body.clientId!==undefined&&(!isString(body.clientId)||!body.clientId))errors.push('Cliente é obrigatório.');
  if(body.amount!==undefined&&(!Number.isFinite(Number(body.amount))||Number(body.amount)<0))errors.push('Valor inválido.');
  if(body.referenceMonth!==undefined&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(body.referenceMonth))errors.push('Mês de referência inválido.');
  if(body.dueDate!==undefined&&Number.isNaN(Date.parse(body.dueDate)))errors.push('Vencimento inválido.');
  if(body.status&&!['pendente','pago','atrasado','cancelado'].includes(body.status))errors.push('Status da mensalidade inválido.');
  return errors;
}

export function settingsSchema(body) {
  const errors=[];
  for(const key of ['systemName','companyName'])if(body[key]!==undefined&&(!isString(body[key])||body[key].trim().length<2))errors.push(`${key} deve ter pelo menos 2 caracteres.`);
  if(body.logoUrl!==undefined&&(!isString(body.logoUrl)||body.logoUrl.length>2000))errors.push('URL do logo inválida.');
  for(const key of ['defaultCreationFee','defaultMonthlyFee'])if(body[key]!==undefined&&(!Number.isFinite(Number(body[key]))||Number(body[key])<0))errors.push(`${key} deve ser um valor positivo.`);
  return errors;
}
