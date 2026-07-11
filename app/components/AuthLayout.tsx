import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

export default function AuthLayout({ children, isLogin = true }: AuthLayoutProps) {
  return (
    <section className={`${isLogin ? '_social_login_wrapper' : '_social_registration_wrapper'} _layout_main_wrapper`}>
      <div className="_shape_one">
        <img src="/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/images/shape2.svg" alt="" className="_shape_img" />
        <img src="/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/images/shape3.svg" alt="" className="_shape_img" />
        <img src="/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className={isLogin ? '_social_login_wrap' : '_social_registration_wrap'}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className={isLogin ? '_social_login_left' : '_social_registration_left'}>
                <div className={isLogin ? '_social_login_left_image' : '_social_registration_left_image'}>
                  <img
                    src={isLogin ? '/images/login.png' : '/images/registration.png'}
                    alt="Image"
                    className={isLogin ? '_left_img' : '_right_img'}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
