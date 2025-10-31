import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from '../../router/all_routes';
import {
  useResetPasswordMutation,
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
} from './resetPasswordApi';

const ForgotPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();

  // Step state: 1 = Email, 2 = Verify Code, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // RTK Query mutations
  const [sendVerificationCode, { isLoading: isSendingCode }] = useSendVerificationCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Validation helpers
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Step 1: Send verification code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      const response = await sendVerificationCode({ email }).unwrap();
      console.log('Verification code sent:', response);
      // Move to step 2 to enter verification code
      setStep(2);
    } catch (error: any) {
      console.error('Failed to send verification code:', error);
      setErrors({
        email:
          error?.data?.message ||
          error?.data?.email?.[0] ||
          'Failed to send verification code. Please check your email.',
      });
    }
  };

  // Step 2: Verify the code and move to password reset
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!code) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    try {
      const response = await verifyCode({ email, code }).unwrap();
      console.log('Code verified:', response);
      // Only move to step 3 if verification is successful
      setStep(3);
    } catch (error: any) {
      console.error('Failed to verify code:', error);
      setErrors({
        code:
          error?.data?.message ||
          error?.data?.code?.[0] ||
          'Invalid verification code. Please try again.',
      });
    }
  };

  // Step 3: Reset password with email, code, and new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await resetPassword({
        email,
        code,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      console.log('Password reset successful:', response);

      // Show success message and redirect to login
      alert('Password reset successfully! Please login with your new password.');
      navigate(routes.login);
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      setErrors({
        submit:
          error?.data?.message ||
          error?.data?.detail ||
          'Failed to reset password. Please try again.',
      });
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    setErrors({});
  };

  const isLoading = isSendingCode || isVerifying || isResetting;

  return (
    <>
      <div className="container-fuild">
        <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row">
            <div className="col-lg-6">
              <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
                <div>
                  <ImageWithBasePath
                    src="assets/img/authentication/authentication-03.jpg"
                    alt="Img"
                  />
                </div>
                <div className="authen-overlay-item w-100 p-4">
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
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/authentication/authentication-logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body p-4">
                        {/* Step Indicator */}
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className={`text-center flex-fill ${
                                step >= 1 ? 'text-primary' : 'text-muted'
                              }`}
                            >
                              <div
                                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                                  step >= 1 ? 'bg-primary text-white' : 'bg-light'
                                }`}
                                style={{ width: '40px', height: '40px' }}
                              >
                                1
                              </div>
                              <div className="small mt-1">Email</div>
                            </div>
                            <div
                              className={`flex-fill border-top ${
                                step >= 2 ? 'border-primary' : 'border-secondary'
                              }`}
                              style={{ marginTop: '-15px' }}
                            ></div>
                            <div
                              className={`text-center flex-fill ${
                                step >= 2 ? 'text-primary' : 'text-muted'
                              }`}
                            >
                              <div
                                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                                  step >= 2 ? 'bg-primary text-white' : 'bg-light'
                                }`}
                                style={{ width: '40px', height: '40px' }}
                              >
                                2
                              </div>
                              <div className="small mt-1">Verify</div>
                            </div>
                            <div
                              className={`flex-fill border-top ${
                                step >= 3 ? 'border-primary' : 'border-secondary'
                              }`}
                              style={{ marginTop: '-15px' }}
                            ></div>
                            <div
                              className={`text-center flex-fill ${
                                step >= 3 ? 'text-primary' : 'text-muted'
                              }`}
                            >
                              <div
                                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                                  step >= 3 ? 'bg-primary text-white' : 'bg-light'
                                }`}
                                style={{ width: '40px', height: '40px' }}
                              >
                                3
                              </div>
                              <div className="small mt-1">Reset</div>
                            </div>
                          </div>
                        </div>

                        {/* Step 1: Email */}
                        {step === 1 && (
                          <form onSubmit={handleSendCode}>
                            <div className="mb-4">
                              <h2 className="mb-2">Forgot Password?</h2>
                              <p className="mb-0">
                                Enter your email address and we'll send you a verification code to
                                reset your password.
                              </p>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Email Address</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-mail" />
                                </span>
                                <input
                                  type="email"
                                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Enter your email"
                                  disabled={isLoading}
                                />
                                {errors.email && (
                                  <div className="invalid-feedback">{errors.email}</div>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                              >
                                {isSendingCode ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Sending Code...
                                  </>
                                ) : (
                                  'Send Verification Code'
                                )}
                              </button>
                            </div>
                            <div className="text-center">
                              <h6 className="fw-normal text-dark mb-0">
                                Return to{' '}
                                <Link to={routes.login} className="hover-a ">
                                  Login
                                </Link>
                              </h6>
                            </div>
                          </form>
                        )}

                        {/* Step 2: Verify Code */}
                        {step === 2 && (
                          <form onSubmit={handleVerifyCode}>
                            <div className="mb-4">
                              <h2 className="mb-2">Verify Code</h2>
                              <p className="mb-0">
                                We've sent a verification code to <strong>{email}</strong>. Please
                                enter the code below.
                              </p>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Verification Code</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-key" />
                                </span>
                                <input
                                  type="text"
                                  className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                  value={code}
                                  onChange={(e) => setCode(e.target.value)}
                                  placeholder="Enter verification code"
                                  disabled={isLoading}
                                  maxLength={6}
                                />
                                {errors.code && (
                                  <div className="invalid-feedback">{errors.code}</div>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                              >
                                {isVerifying ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Verifying...
                                  </>
                                ) : (
                                  'Verify Code'
                                )}
                              </button>
                            </div>
                            <div className="text-center">
                              <h6 className="fw-normal text-dark mb-0">
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={handleBack}
                                  disabled={isLoading}
                                >
                                  Back to Email
                                </button>
                              </h6>
                            </div>
                          </form>
                        )}

                        {/* Step 3: Reset Password */}
                        {step === 3 && (
                          <form onSubmit={handleResetPassword}>
                            <div className="mb-4">
                              <h2 className="mb-2">Reset Password</h2>
                              <p className="mb-0">Enter your new password below.</p>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">New Password</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-lock" />
                                </span>
                                <input
                                  type="password"
                                  className={`form-control ${
                                    errors.newPassword ? 'is-invalid' : ''
                                  }`}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Enter new password"
                                  disabled={isLoading}
                                />
                                {errors.newPassword && (
                                  <div className="invalid-feedback">{errors.newPassword}</div>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Confirm Password</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-lock" />
                                </span>
                                <input
                                  type="password"
                                  className={`form-control ${
                                    errors.confirmPassword ? 'is-invalid' : ''
                                  }`}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password"
                                  disabled={isLoading}
                                />
                                {errors.confirmPassword && (
                                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                                )}
                              </div>
                            </div>
                            {errors.submit && (
                              <div className="alert alert-danger mb-3">{errors.submit}</div>
                            )}
                            <div className="mb-3">
                              <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                              >
                                {isResetting ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Resetting Password...
                                  </>
                                ) : (
                                  'Reset Password'
                                )}
                              </button>
                            </div>
                            <div className="text-center">
                              <h6 className="fw-normal text-dark mb-0">
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={handleBack}
                                  disabled={isLoading}
                                >
                                  Back
                                </button>
                              </h6>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0 ">Copyright © 2024 - Preskool</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
