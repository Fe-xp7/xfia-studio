import crypto from 'crypto';
import { DeploymentService } from './DeploymentService.js';

export class LocalDeploymentService extends DeploymentService {
  constructor({ publicSiteUrl }) { super(); this.publicSiteUrl=publicSiteUrl.replace(/\/$/,''); }
  async deploy(site) {
    return { deploymentId:`local_${crypto.randomUUID()}`,previewUrl:`${this.publicSiteUrl}/preview/${site.slug}`,productionUrl:'',provider:'local',deployedAt:new Date() };
  }
}
