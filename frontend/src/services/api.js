const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(!isFormData ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 401 && path !== '/auth/login') {
    localStorage.removeItem('admin_token');
    window.dispatchEvent(new Event('auth:expired'));
  }
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Não foi possível concluir a operação.');
  return data;
}

export function getTenantHostname() {
  const hostname = window.location.hostname.toLowerCase();
  const configured = String(import.meta.env.VITE_PUBLIC_SITE_BASE_DOMAIN || 'localhost').split(':')[0].toLowerCase();
  if (hostname === configured || hostname === `www.${configured}`) return '';
  if (hostname.endsWith(`.${configured}`)) return hostname;
  return import.meta.env.VITE_ENABLE_CUSTOM_DOMAINS === 'true' ? hostname : '';
}
