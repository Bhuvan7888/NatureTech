/**
 * Get base API URL for Vercel production and local development environments.
 */
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  // Return empty string on client side to use relative Next.js proxy rewrites
  if (typeof window !== 'undefined') {
    // If running in browser and no NEXT_PUBLIC_API_URL is set,
    // check if we are on localhost vs production domain
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
    // On Vercel deployment without custom env var, relative URL relies on Next.js rewrites
    return '';
  }
  return 'http://127.0.0.1:8000';
};
