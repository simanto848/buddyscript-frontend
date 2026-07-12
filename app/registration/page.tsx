'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { registerAction } from './actions';

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
        <button type="button" className="_social_registration_content_btn _mar_b40">
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
                <button type="submit" className="_social_registration_form_btn_link _btn1" disabled={loading}>
                  {loading ? 'Registering...' : 'Register now'}
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
