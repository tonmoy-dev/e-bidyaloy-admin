import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import {
  useResendVerificationCodeMutation,
  useVerifyEmailMutation,
} from '../../../core/services/authApi';
import { all_routes } from '../../router/all_routes';

const EmailVerification = () => {
  const routes = all_routes;
  const navigate = useNavigate();

  // RTK Query hooks
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendVerificationCodeMutation();

  // State
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Get email from session storage on component mount
  useEffect(() => {
    const principalEmail = sessionStorage.getItem('principalEmail');
    if (principalEmail) {
      setEmail(principalEmail);
    } else {
      // If no email found, redirect to register
      navigate(routes.register);
    }
  }, [navigate, routes.register]);

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    // Clear any existing errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Verification code is required');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await verifyEmail({
        email: email,
        code: code.trim(),
      }).unwrap();

      setSuccessMessage('Email verified successfully! Redirecting to login...');

      // Clear the stored email
      sessionStorage.removeItem('principalEmail');

      // Navigate to login page after successful verification
      setTimeout(() => {
        navigate(routes.login);
      }, 2000);
    } catch (err: unknown) {
      console.error('Email verification error:', err);

      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as {
          data?: {
            detail?: string | string[];
            code?: string | string[];
            email?: string | string[];
            non_field_errors?: string | string[];
          };
          message?: string;
        };

        if (error.data?.code) {
          setError(
            `Verification code: ${
              Array.isArray(error.data.code) ? error.data.code.join(', ') : error.data.code
            }`,
          );
        } else if (error.data?.email) {
          setError(
            `Email: ${
              Array.isArray(error.data.email) ? error.data.email.join(', ') : error.data.email
            }`,
          );
        } else if (error.data?.detail) {
          setError(
            Array.isArray(error.data.detail) ? error.data.detail.join(', ') : error.data.detail,
          );
        } else if (error.data?.non_field_errors) {
          setError(
            Array.isArray(error.data.non_field_errors)
              ? error.data.non_field_errors.join(', ')
              : error.data.non_field_errors,
          );
        } else {
          setError(error.message || 'Verification failed. Please try again.');
        }
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await resendCode({ email }).unwrap();
      setSuccessMessage('Verification code sent successfully!');
      setIsResendDisabled(true);
      setResendTimer(60); // 60 seconds cooldown
    } catch (err: unknown) {
      console.error('Resend verification error:', err);

      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as {
          data?: {
            detail?: string | string[];
            email?: string | string[];
            non_field_errors?: string | string[];
          };
          message?: string;
        };

        if (error.data?.email) {
          setError(
            `Email: ${
              Array.isArray(error.data.email) ? error.data.email.join(', ') : error.data.email
            }`,
          );
        } else if (error.data?.detail) {
          setError(
            Array.isArray(error.data.detail) ? error.data.detail.join(', ') : error.data.detail,
          );
        } else if (error.data?.non_field_errors) {
          setError(
            Array.isArray(error.data.non_field_errors)
              ? error.data.non_field_errors.join(', ')
              : error.data.non_field_errors,
          );
        } else {
          setError(error.message || 'Failed to resend code. Please try again.');
        }
      } else {
        setError('Failed to resend code. Please try again.');
      }
    }
  };

  const handleSkipVerification = () => {
    // Clear stored email and navigate to login
    sessionStorage.removeItem('principalEmail');
    navigate(routes.login);
  };

  return (
    <div className="container-fuild">
      <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
              <div>
                <ImageWithBasePath
                  src="assets/img/authentication/authentication-01.jpg"
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
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-9 mx-auto p-4">
                <form onSubmit={handleVerifySubmit}>
                  <div>
                    <div className="mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/authentication/authentication-logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body p-4">
                        <div className="mb-4">
                          <h2 className="mb-2 text-center">Verify your Email</h2>
                          <p className="mb-0 text-center">
                            We've sent a verification code to <strong>{email}</strong>. Please enter
                            the code below to continue.
                          </p>
                        </div>

                        {error && (
                          <div className="alert alert-danger mb-3" role="alert">
                            {error}
                          </div>
                        )}

                        {successMessage && (
                          <div className="alert alert-success mb-3" role="alert">
                            {successMessage}
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="form-label">Verification Code *</label>
                          <div className="input-icon position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-shield-check" />
                            </span>
                            <input
                              type="text"
                              value={code}
                              onChange={handleCodeChange}
                              className="form-control"
                              placeholder="Enter verification code"
                              maxLength={6}
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isVerifying}
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
                              'Verify Email'
                            )}
                          </button>
                        </div>

                        <div className="text-center mb-3">
                          <h6 className="fw-normal text-dark mb-0">
                            Didn't receive the code?{' '}
                            <button
                              type="button"
                              onClick={handleResendCode}
                              className="btn btn-link p-0 hover-a"
                              disabled={isResending || isResendDisabled}
                            >
                              {isResending ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Sending...
                                </>
                              ) : isResendDisabled ? (
                                `Resend in ${resendTimer}s`
                              ) : (
                                'Resend Code'
                              )}
                            </button>
                          </h6>
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={handleSkipVerification}
                            className="btn btn-outline-secondary"
                          >
                            Skip for Now
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="mb-0">Copyright © 2024 - Preskool</p>
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

export default EmailVerification;
