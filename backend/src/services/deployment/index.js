import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { LocalDeploymentService } from './LocalDeploymentService.js';
import { MultiTenantDeploymentService } from './MultiTenantDeploymentService.js';

const multiTenant=()=>new MultiTenantDeploymentService({publicSiteUrl:env.publicSiteUrl,baseDomain:env.publicSiteBaseDomain,scheme:env.publicSiteScheme,mode:env.publicSiteMode});
const providers={local:multiTenant,multitenant:multiTenant,legacyLocal:()=>new LocalDeploymentService({publicSiteUrl:env.publicSiteUrl})};
export function getDeploymentService(){
  const create=providers[env.deploymentProvider];
  if(!create)throw new AppError(`Provedor de publicação não configurado: ${env.deploymentProvider}`,503);
  return create();
}
