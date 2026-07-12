'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { loginAction } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (!res.success) {
        setError(res.error || 'Login failed. Please check your credentials.');
      } else {
        // Successful login, redirect to feed
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <div className="_social_login_content">
        <div className="_social_login_left_logo _mar_b28">
          <img src="/images/logo.svg" alt="Image" className="_left_logo" />
        </div>
        <p className="_social_login_content_para _mar_b8">Welcome back</p>
        <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
        <button type="button" className="_social_login_content_btn _mar_b40">
          <img src="/images/google.svg" alt="Image" className="_google_img" /> <span>Or sign-in with google</span>
        </button>
        <div className="_social_login_content_bottom_txt _mar_b40">
          <span>Or</span>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form className="_social_login_form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <InputField
                label="Email"
                type="email"
                isLogin={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <InputField
                label="Password"
                type="password"
                isLogin={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
              <div className="form-check _social_login_form_check">
                <input
                  className="form-check-input _social_login_form_check_input"
                  type="radio"
                  id="rememberMe"
                  name="rememberMe"
                  defaultChecked
                />
                <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
              <div className="_social_login_form_left">
                <p className="_social_login_form_left_para" style={{ cursor: 'pointer' }}>Forgot password?</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
              <div className="_social_login_form_btn _mar_t40 _mar_b60">
                <button type="submit" className="_social_login_form_btn_link _btn1" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login now'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_bottom_txt">
              <p className="_social_login_bottom_txt_para">
                Dont have an account? <Link href="/registration">Create New Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
