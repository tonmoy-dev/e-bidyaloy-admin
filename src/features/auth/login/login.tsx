import type React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { useAppDispatch, useAppSelector } from '../../../core/store';
import { clearError, initializeAuth, loginUser } from '../../../core/store/slices/authSlice';
import { all_routes } from '../../router/all_routes';
// import { useAppDispatch, useAppSelector } from '../core/store';
// import { clearError, initializeAuth, loginUser } from '../core/store/slices/authSlice';

const Login = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading, error, loginAttempts, lastLoginAttempt } = useAppSelector(
    (state) => state.auth,
  );

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.adminDashboard);
    }
    localStorage.setItem('menuOpened', 'Dashboard');
  }, [isAuthenticated, navigate, routes.adminDashboard]);

  useEffect(() => {
    if (loginAttempts >= 3 && lastLoginAttempt) {
      const blockDuration = 15 * 60 * 1000; // 15 minutes
      const timeElapsed = Date.now() - lastLoginAttempt;

      if (timeElapsed < blockDuration) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockDuration - timeElapsed) / 1000));

        const timer = setInterval(() => {
          const newTimeElapsed = Date.now() - lastLoginAttempt;
          const remaining = Math.ceil((blockDuration - newTimeElapsed) / 1000);

          if (remaining <= 0) {
            setIsBlocked(false);
            setBlockTimeRemaining(0);
            clearInterval(timer);
          } else {
            setBlockTimeRemaining(remaining);
          }
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setIsBlocked(false);
        setBlockTimeRemaining(0);
      }
    }
  }, [loginAttempts, lastLoginAttempt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear auth error when user modifies form
    if (error) {
      dispatch(clearError());
    }
  };

  // const validateForm = () => {
  //   // const errors = {
  //   //   email: '',
  //   //   password: '',
  //   // };

  //   // if (!formData.email.trim()) {
  //   //   errors.email = 'Email is required';
  //   // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //   //   errors.email = 'Please enter a valid email address';
  //   // }

  //   // if (!formData.password.trim()) {
  //   //   errors.password = 'Password is required';
  //   // } else if (formData.password.length < 1) {
  //   //   errors.password = 'Password must be at least 6 characters';
  //   // }

  //   // setFormErrors(errors);
  //   // return !errors.email && !errors.password;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      return;
    }

    // if (!validateForm()) {
    //   return;
    // }

    try {
      await dispatch(
        loginUser({
          username: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      ).unwrap();

      console.log('Login successful, redirecting...');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const formatBlockTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const date = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath src="assets/img/authentication/authentication-02.jpg" alt="" />
              </div>
              <div className="authen-overlay-item  w-100 p-4">
                <h4 className="text-white mb-3">What's New on Preskool !!!</h4>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>New Academic Session Admission Start(2024-25)</h6>
                    <p className="mb-0 text-truncate">
                      An academic term is a portion of an academic year, the time ....
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Date sheet Final Exam Nursery to Sr.Kg</h6>
                    <p className="mb-0 text-truncate">
                      Dear Parents, As the final examination for the session 2024-25 is ...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Annual Day Function</h6>
                    <p className="mb-0 text-truncate">
                      Annual functions provide a platform for students to showcase their...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
                <div className="d-flex align-items-center flex-row mb-0 justify-content-between p-3 br-5 gap-3 card">
                  <div>
                    <h6>Summer Vacation Holiday Homework</h6>
                    <p className="mb-0 text-truncate">
                      The school will remain closed from April 20th to June 15th for summer...
                    </p>
                  </div>
                  <Link to="#">
                    <i className="ti ti-chevrons-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/authentication/authentication-logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body pb-3">
                        <div className=" mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">Please enter your details to sign in</p>
                        </div>

                        {error && (
                          <div className="alert alert-danger mb-3" role="alert">
                            <i className="ti ti-alert-circle me-2"></i>
                            {error}
                          </div>
                        )}

                        {isBlocked && (
                          <div className="alert alert-warning mb-3" role="alert">
                            <i className="ti ti-lock me-2"></i>
                            Too many failed attempts. Please try again in{' '}
                            {formatBlockTime(blockTimeRemaining)}.
                          </div>
                        )}

                        {loginAttempts > 0 && loginAttempts < 3 && !isBlocked && (
                          <div className="alert alert-info mb-3" role="alert">
                            <i className="ti ti-info-circle me-2"></i>
                            {3 - loginAttempts} attempt(s) remaining before temporary lockout.
                          </div>
                        )}

                        <div className="mb-3 ">
                          <label className="form-label">User Name</label>
                          <div className="input-icon mb-3 position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-mail" />
                            </span>
                            <input
                              type="text"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                              placeholder="Enter your email"
                              disabled={isLoading || isBlocked}
                            />
                            {formErrors.email && (
                              <div className="invalid-feedback">{formErrors.email}</div>
                            )}
                          </div>

                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`pass-input form-control ${
                                formErrors.password ? 'is-invalid' : ''
                              }`}
                              placeholder="Enter your password"
                              disabled={isLoading || isBlocked}
                            />
                            <span
                              className={`ti toggle-password ${
                                isPasswordVisible ? 'ti-eye' : 'ti-eye-off'
                              }`}
                              onClick={togglePasswordVisibility}
                            />
                            {formErrors.password && (
                              <div className="invalid-feedback">{formErrors.password}</div>
                            )}
                          </div>
                        </div>

                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={isLoading || isBlocked}
                              />
                            </div>
                            <p className="ms-1 mb-0 ">Remember Me</p>
                          </div>
                          <div className="text-end ">
                            <Link to={routes.forgotPassword} className="link-danger">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading || isBlocked}
                          >
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Signing In...
                              </>
                            ) : isBlocked ? (
                              `Blocked - ${formatBlockTime(blockTimeRemaining)}`
                            ) : (
                              'Sign In'
                            )}
                          </button>
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Don't have an account?{' '}
                            <Link to={routes.register} className="hover-a ">
                              {' '}
                              Create Account
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0 ">Copyright © {date()} - Paglaschool</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
