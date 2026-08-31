import crypto from 'crypto';
import { DeploymentService } from './DeploymentService.js';

const RESERVED = new Set(['admin', 'api', 'app', 'assets', 'billing', 'clientes', 'help', 'mail', 'preview', 'status', 'support', 'www']);

export function normalizeSubdomain(value) {
  const normalized = String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-').slice(0, 63);
  if (!normalized || normalized.length < 3 || RESERVED.has(normalized)) return '';
  return normalized;
}

export class MultiTenantDeploymentService extends DeploymentService {
  constructor({ publicSiteUrl, baseDomain, scheme, mode = 'subdomain' }) {
    super();
    this.publicSiteUrl = publicSiteUrl.replace(/\/$/, '');
    this.baseDomain = baseDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.scheme = scheme;
    this.mode = mode;
  }

  async deploy(site) {
    const subdomain = normalizeSubdomain(site.publication?.subdomain || site.slug);
    if (!subdomain) throw new Error('Não foi possível reservar um subdomínio válido para este site.');
    const version = Number(site.publication?.version || 0) + 1;
    return {
      deploymentId: `tenant_${crypto.randomUUID()}`,
      previewUrl: `${this.publicSiteUrl}/preview/${site.slug}`,
      productionUrl: this.mode === 'path' ? `${this.publicSiteUrl}/site/${subdomain}` : `${this.scheme}://${subdomain}.${this.baseDomain}`,
      provider: 'cloudflare-worker', subdomain, version, deployedAt: new Date(),
    };
  }
}
