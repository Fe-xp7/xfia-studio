const SECURITY_HEADERS = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
};

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
    const contentType = headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
