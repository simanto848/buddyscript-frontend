'use server';

import { cookies } from 'next/headers';
import { useAxios } from '../../lib/api';
import axios from 'axios';

export async function loginAction(payload: any) {
  try {
    const api = await useAxios();
    const data: any = await api.post('/auth/login', payload);

    const cookieStore = await cookies();
    cookieStore.set('token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'An error occurred during login.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message || errorMessage;
    } else if (error && typeof error === 'object') {
      errorMessage = error.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function googleLoginAction(payload: { idToken?: string, accessToken?: string }) {
  try {
    const api = await useAxios();
    const data: any = await api.post('/auth/google', payload);

    const cookieStore = await cookies();
    cookieStore.set('token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'An error occurred during Google login.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message || errorMessage;
    } else if (error && typeof error === 'object') {
      errorMessage = error.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}
