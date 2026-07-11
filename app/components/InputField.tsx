import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isLogin?: boolean;
}

export default function InputField({ label, isLogin = true, ...props }: InputFieldProps) {
  const wrapperClass = isLogin ? '_social_login_form_input _mar_b14' : '_social_registration_form_input _mar_b14';
  const labelClass = isLogin ? '_social_login_label _mar_b8' : '_social_registration_label _mar_b8';
  const inputClass = isLogin ? 'form-control _social_login_input' : 'form-control _social_registration_input';

  return (
    <div className={wrapperClass}>
      <label className={labelClass}>{label}</label>
      <input className={inputClass} {...props} />
    </div>
  );
}
