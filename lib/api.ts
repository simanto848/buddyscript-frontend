import axios from 'axios';

/**
 * Create an authenticated API instance for requests (both client and server side)
 */
export async function useAxios(token?: string) {
  let authToken = token;

  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      authToken = token || cookieStore.get('token')?.value;
    } catch (e) {
      // cookies() might throw if called outside a Server context
    }
  } else {
    try {
      const match = document.cookie.match(/(^|;)\s*token\s*=\s*([^;]+)/);
      authToken = token || (match ? decodeURIComponent(match[2]) : undefined);
    } catch (e) {
      // Fallback
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    timeout: 30000,
    headers,
    withCredentials: true,
  });

  // Request interceptor to handle FormData
  api.interceptors.request.use(
    (config) => {
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response?.data,
    (error) => {
      return Promise.reject(error?.response || error);
    }
  );

  return api;
}
