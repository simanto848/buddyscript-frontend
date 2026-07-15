'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { registerAction } from './actions';
import { googleLoginAction } from '../login/actions';

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in cookie client-side
    const match = document.cookie.match(/(^|;)\s*token\s*=\s*([^;]+)/);
    if (match) {
      router.push('/');
      return;
    }

    // Load Google Identity Services client script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const handleGoogleLogin = () => {
    if (typeof window === 'undefined' || !(window as any).google) {
      setError('Google Sign-In is still loading. Please try again in a moment.');
      return;
    }

    const google = (window as any).google;
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '529638142981323-doxwcoxl5.apps.googleusercontent.com',
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: async (response: any) => {
        if (response.error) {
          setError('Google authentication failed.');
          return;
        }
        setLoading(true);
        setError(null);
        try {
          const res = await googleLoginAction({ accessToken: response.access_token });
          if (!res.success) {
            setError(res.error || 'Google registration/login failed.');
          } else {
            router.push('/');
            router.refresh();
          }
        } catch (err: any) {
          setError(err?.message || 'Something went wrong during Google Login.');
        } finally {
          setLoading(false);
        }
      },
    });

    client.requestAccessToken();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!agree) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerAction({ firstName, lastName, email, password });
      if (!res.success) {
        setError(res.error || 'Registration failed.');
      } else {
        // Redirect to feed
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
    <AuthLayout isLogin={false}>
      <div className="_social_registration_content">
        <div className="_social_registration_right_logo _mar_b28">
          <img src="/images/logo.svg" alt="Image" className="_right_logo" />
        </div>
        <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
        <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
        <button 
          type="button" 
          className="_social_registration_content_btn _mar_b40"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <img src="/images/google.svg" alt="Image" className="_google_img" /> <span>Register with google</span>
        </button>
        <div className="_social_registration_content_bottom_txt _mar_b40">
          <span>Or</span>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form className="_social_registration_form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <InputField
                label="First Name"
                type="text"
                isLogin={false}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <InputField
                label="Last Name"
                type="text"
                isLogin={false}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <InputField
                label="Email"
                type="email"
                isLogin={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <InputField
                label="Password"
                type="password"
                isLogin={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <InputField
                label="Repeat Password"
                type="password"
                isLogin={false}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
              <div className="form-check _social_registration_form_check">
                <input
                  className="form-check-input _social_registration_form_check_input"
                  type="radio"
                  id="agreeTerms"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <label className="form-check-label _social_registration_form_check_label" htmlFor="agreeTerms">
                  I agree to terms & conditions
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
              <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                <button 
                  type="submit" 
                  className="_social_registration_form_btn_link _btn1" 
                  disabled={loading}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Register now
                  {loading && (
                    <span 
                      className="spinner-border spinner-border-sm" 
                      role="status" 
                      aria-hidden="true" 
                      style={{ 
                        width: '1em', 
                        height: '1em', 
                        borderWidth: '0.15em', 
                        marginLeft: '8px', 
                        display: 'inline-block',
                        verticalAlign: 'text-bottom'
                      }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_bottom_txt">
              <p className="_social_registration_bottom_txt_para">
                Already have an account? <Link href="/login">Login Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
