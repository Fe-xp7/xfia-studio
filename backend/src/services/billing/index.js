import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { MockBillingProvider } from './MockBillingProvider.js';
import { AsaasBillingProvider } from './AsaasBillingProvider.js';
export function getBillingProvider(){if(env.billingProvider==='mock')return new MockBillingProvider();if(env.billingProvider==='asaas')return new AsaasBillingProvider({apiUrl:env.asaasApiUrl,apiKey:env.asaasApiKey});throw new AppError(`Provedor de billing desconhecido: ${env.billingProvider}`,503);}
