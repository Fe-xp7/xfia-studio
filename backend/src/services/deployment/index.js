import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { LocalDeploymentService } from './LocalDeploymentService.js';

const providers={local:()=>new LocalDeploymentService({publicSiteUrl:env.publicSiteUrl})};
export function getDeploymentService(){
  const create=providers[env.deploymentProvider];
  if(!create)throw new AppError(`Provedor de publicação não configurado: ${env.deploymentProvider}`,503);
  return create();
}
