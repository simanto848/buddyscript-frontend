'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agree, setAgree] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Registration submitted:', { email, password, agree });
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
        <form className="_social_registration_form" onSubmit={handleSubmit}>
          <div className="row">
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
                <button type="submit" className="_social_registration_form_btn_link _btn1">
                  Register now
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
