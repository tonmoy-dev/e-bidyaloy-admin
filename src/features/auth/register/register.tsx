import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import {
  useRegisterMutation,
  useResendVerificationCodeMutation,
  useVerifyRegistrationMutation,
} from '../../../core/services/authService';
import { all_routes } from '../../router/all_routes';

type PasswordField = 'password' | 'confirmPassword';

interface RegistrationFormData {
  // Basic Registration
  schoolName: string;
  ieenNumber: string;
  schoolWebsite: string;
  phoneNumber: string;

  // Institutional Info
  address: string;
  principalName: string;
  totalTeachers: number | string;
  totalStudents: number | string;
  classes: string;
  totalSections: number | string;

  // System Features
  hasBiometricSystem: boolean;
  hasUniqueIds: boolean;
  hasExistingWebsite: boolean;

  // Authentication
  officialEmail: string;
  password: string;
  confirmPassword: string;

  // Terms agreement
  agreeToTerms: boolean;
}

interface VerificationData {
  verificationCode: string;
}

const Register = () => {
  const routes = all_routes;
  const navigate = useNavigate();

  // RTK Query hooks
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyRegistration, { isLoading: isVerifying }] = useVerifyRegistrationMutation();
  const [resendCode, { isLoading: isResending }] = useResendVerificationCodeMutation();

  const [currentStep, setCurrentStep] = useState<'register' | 'verify'>('register');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState<RegistrationFormData>({
    schoolName: '',
    ieenNumber: '',
    schoolWebsite: '',
    phoneNumber: '',
    address: '',
    principalName: '',
    totalTeachers: '',
    totalStudents: '',
    classes: '',
    totalSections: '',
    hasBiometricSystem: false,
    hasUniqueIds: false,
    hasExistingWebsite: false,
    officialEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [verificationData, setVerificationData] = useState<VerificationData>({
    verificationCode: '',
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.schoolName.trim()) {
      setError('School name is required');
      return false;
    }
    if (!formData.ieenNumber.trim()) {
      setError('IEEN number is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.principalName.trim()) {
      setError('Principal name is required');
      return false;
    }
    if (!formData.totalTeachers || formData.totalTeachers === '') {
      setError('Total number of teachers is required');
      return false;
    }
    if (!formData.totalStudents || formData.totalStudents === '') {
      setError('Total number of students is required');
      return false;
    }
    if (!formData.classes.trim()) {
      setError('Classes information is required');
      return false;
    }
    if (!formData.totalSections || formData.totalSections === '') {
      setError('Total number of sections is required');
      return false;
    }
    if (!formData.officialEmail.trim()) {
      setError('Official email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (!formData.confirmPassword) {
      setError('Confirm password is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and privacy policy');
      return false;
    }

    setError(null);
    return true;
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const registrationPayload = {
        username: formData.officialEmail,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        school_name: formData.schoolName,
        ieen_number: formData.ieenNumber,
        school_website: formData.schoolWebsite,
        phone_number: formData.phoneNumber,
        address: formData.address,
        principal_name: formData.principalName,
        total_teachers: Number(formData.totalTeachers),
        total_students: Number(formData.totalStudents),
        classes: formData.classes,
        total_sections: Number(formData.totalSections),
        has_biometric_system: formData.hasBiometricSystem,
        has_unique_ids: formData.hasUniqueIds,
        has_existing_website: formData.hasExistingWebsite,
      };

      const result = await register(registrationPayload).unwrap();

      setSuccessMessage('Registration successful! Please check your email for verification code.');
      setCurrentStep('verify');
    } catch (err: any) {
      // Handle API errors
      if (err.data && err.data.username) {
        setError(`Username: ${err.data.username.join(', ')}`);
      } else if (err.data && err.data.password) {
        setError(`Password: ${err.data.password.join(', ')}`);
      } else if (err.data && err.data.password_confirm) {
        setError(`Password confirmation: ${err.data.password_confirm.join(', ')}`);
      } else if (err.data && err.data.detail) {
        setError(err.data.detail);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationData.verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    setError(null);

    try {
      await verifyRegistration({
        code: verificationData.verificationCode,
        email: formData.officialEmail,
      }).unwrap();

      setSuccessMessage('Email verified successfully! You can now login.');

      // Navigate to login after successful verification
      setTimeout(() => {
        navigate(routes.login);
      }, 2000);
    } catch (err: any) {
      setError(err.data?.detail || err.message || 'Verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setError(null);

    try {
      await resendCode({ email: formData.officialEmail }).unwrap();
      setSuccessMessage('Verification code has been resent to your email.');
    } catch (err: any) {
      setError(err.data?.detail || err.message || 'Failed to resend verification code.');
    }
  };

  const renderRegistrationForm = () => (
    <>
      <div className="mb-4">
        <h2 className="mb-2">Register Your School</h2>
        <p className="mb-0">Please enter your school details to sign up</p>
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

      {/* Basic School Information */}
      <div className="mb-4">
        <h5 className="text-primary mb-3">School Information</h5>

        <div className="mb-3">
          <label className="form-label">School Name *</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-building" />
            </span>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter school name"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">IEEN Number *</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-id" />
            </span>
            <input
              type="text"
              name="ieenNumber"
              value={formData.ieenNumber}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter IEEN number"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">School Website Domain</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-world" />
            </span>
            <input
              type="url"
              name="schoolWebsite"
              value={formData.schoolWebsite}
              onChange={handleInputChange}
              className="form-control"
              placeholder="https://www.yourschool.com"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number *</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-phone" />
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
      </div>

      {/* Institutional Information */}
      <div className="mb-4">
        <h5 className="text-primary mb-3">Institutional Information</h5>

        <div className="mb-3">
          <label className="form-label">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
            rows={3}
            placeholder="Enter complete school address"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Principal Name *</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-user-star" />
            </span>
            <input
              type="text"
              name="principalName"
              value={formData.principalName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter principal name"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Total Number of Teachers *</label>
            <input
              type="number"
              name="totalTeachers"
              value={formData.totalTeachers}
              onChange={handleInputChange}
              className="form-control"
              min="1"
              placeholder="Enter number of teachers"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Total Number of Students *</label>
            <input
              type="number"
              name="totalStudents"
              value={formData.totalStudents}
              onChange={handleInputChange}
              className="form-control"
              min="1"
              placeholder="Enter number of students"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Classes *</label>
          <input
            type="text"
            name="classes"
            value={formData.classes}
            onChange={handleInputChange}
            className="form-control"
            placeholder="e.g., Pre-K to Grade 12"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Number of Sections *</label>
          <input
            type="number"
            name="totalSections"
            value={formData.totalSections}
            onChange={handleInputChange}
            className="form-control"
            min="1"
            placeholder="Enter total sections"
            required
          />
        </div>
      </div>

      {/* System Features */}
      <div className="mb-4">
        <h5 className="text-primary mb-3">System Features</h5>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="hasBiometricSystem"
            checked={formData.hasBiometricSystem}
            onChange={handleInputChange}
            id="biometricCheck"
          />
          <label className="form-check-label" htmlFor="biometricCheck">
            Have Biometric scanning attendance system
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="hasUniqueIds"
            checked={formData.hasUniqueIds}
            onChange={handleInputChange}
            id="uniqueIdsCheck"
          />
          <label className="form-check-label" htmlFor="uniqueIdsCheck">
            Have Unique IDs for student and teacher
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="hasExistingWebsite"
            checked={formData.hasExistingWebsite}
            onChange={handleInputChange}
            id="existingWebsiteCheck"
          />
          <label className="form-check-label" htmlFor="existingWebsiteCheck">
            Have Existing Website for institution
          </label>
        </div>
      </div>

      {/* Authentication Information */}
      <div className="mb-4">
        <h5 className="text-primary mb-3">Authentication Details</h5>

        <div className="mb-3">
          <label className="form-label">School Official Email (Username) *</label>
          <div className="input-icon position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-mail" />
            </span>
            <input
              type="email"
              name="officialEmail"
              value={formData.officialEmail}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter official email"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password *</label>
          <div className="pass-group">
            <input
              type={passwordVisibility.password ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="pass-input form-control"
              placeholder="Enter password"
              required
            />
            <span
              className={`ti toggle-passwords ${
                passwordVisibility.password ? 'ti-eye' : 'ti-eye-off'
              }`}
              onClick={() => togglePasswordVisibility('password')}
            ></span>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password *</label>
          <div className="pass-group">
            <input
              type={passwordVisibility.confirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pass-input form-control"
              placeholder="Confirm password"
              required
            />
            <span
              className={`ti toggle-passwords ${
                passwordVisibility.confirmPassword ? 'ti-eye' : 'ti-eye-off'
              }`}
              onClick={() => togglePasswordVisibility('confirmPassword')}
            ></span>
          </div>
        </div>
      </div>

      <div className="form-wrap form-wrap-checkbox mb-3">
        <div className="d-flex align-items-center">
          <div className="form-check form-check-md mb-0 me-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
          </div>
          <h6 className="fw-normal text-dark mb-0">
            I Agree to
            <Link to="#" className="hover-a">
              {' '}
              Terms & Privacy
            </Link>
          </h6>
        </div>
      </div>

      <div className="mb-3">
        <button type="submit" className="btn btn-primary w-100" disabled={isRegistering}>
          {isRegistering ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Registering...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>
    </>
  );

  const renderVerificationForm = () => (
    <>
      <div className="mb-4">
        <h2 className="mb-2">Verify Your Email</h2>
        <p className="mb-0">
          We've sent a verification code to <strong>{formData.officialEmail}</strong>. Please enter
          the code below to complete your registration.
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
            <i className="ti ti-key" />
          </span>
          <input
            type="text"
            name="verificationCode"
            value={verificationData.verificationCode}
            onChange={handleVerificationChange}
            className="form-control text-center"
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <button type="submit" className="btn btn-primary w-100" disabled={isVerifying}>
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
            'Verify & Complete Registration'
          )}
        </button>
      </div>

      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={handleResendCode}
          disabled={isResending}
        >
          {isResending ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Resending...
            </>
          ) : (
            'Resend Verification Code'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => setCurrentStep('register')}
        >
          ← Back to Registration
        </button>
      </div>
    </>
  );

  return (
    <>
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
                    <Link to="3">
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
                    <Link to="3">
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
                    <Link to="3">
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
                    <Link to="3">
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
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
                <div className="col-md-10 mx-auto p-4">
                  <form
                    onSubmit={
                      currentStep === 'register'
                        ? handleRegistrationSubmit
                        : handleVerificationSubmit
                    }
                  >
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
                          {currentStep === 'register'
                            ? renderRegistrationForm()
                            : renderVerificationForm()}

                          {currentStep === 'register' && (
                            <div className="text-center">
                              <h6 className="fw-normal text-dark mb-0">
                                Already have an account?
                                <Link to={routes.login} className="hover-a">
                                  {' '}
                                  Sign In
                                </Link>
                              </h6>
                            </div>
                          )}
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
    </>
  );
};

export default Register;
