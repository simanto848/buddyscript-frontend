import axios from 'axios';
import { cookies } from 'next/headers';

/**
 * Create an authenticated API instance for server-side requests
 * This should be used in server components and server actions
 */
export async function useAxios(token?: string) {
  let authToken = token;

  try {
    const cookieStore = await cookies();
    authToken = token || cookieStore.get('token')?.value;
  } catch (e) {
    // cookies() might throw if called outside a Server context
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api',
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
