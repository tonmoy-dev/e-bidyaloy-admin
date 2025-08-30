import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { useRegisterMutation } from '../../../core/services/authService';
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
  principalFirstName: string;
  principalLastName: string;
  principalEmail: string;
  principalUsername: string;
  totalTeachers: number | string;
  totalStudents: number | string;
  classes: string;
  totalSections: number | string;

  // System Features
  hasBiometricSystem: boolean;
  hasUniqueIds: boolean;
  hasExistingWebsite: boolean;

  // Authentication
  organizationEmail: string;
  password: string;
  confirmPassword: string;

  // Terms agreement
  agreeToTerms: boolean;
}

const Register = () => {
  const routes = all_routes;
  const navigate = useNavigate();

  // RTK Query hooks
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

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
    principalFirstName: '',
    principalLastName: '',
    principalEmail: '',
    principalUsername: '',
    totalTeachers: '',
    totalStudents: '',
    classes: '',
    totalSections: '',
    hasBiometricSystem: false,
    hasUniqueIds: false,
    hasExistingWebsite: false,
    organizationEmail: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
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

  // Generate slug from school name
  const generateSlug = (name: string): string => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50) + Math.random().toString(36).substring(2, 8)
    );
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
    if (!formData.organizationEmail.trim()) {
      setError('Organization email is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.principalFirstName.trim()) {
      setError('Principal first name is required');
      return false;
    }
    if (!formData.principalLastName.trim()) {
      setError('Principal last name is required');
      return false;
    }
    if (!formData.principalEmail.trim()) {
      setError('Principal email is required');
      return false;
    }
    if (!formData.principalUsername.trim()) {
      setError('Principal username is required');
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
      // Create the payload matching the backend API structure
      const registrationPayload = {
        // School/Organization details
        name: formData.schoolName,
        slug: generateSlug(formData.schoolName),
        website: formData.schoolWebsite,
        ieen_no: formData.ieenNumber,
        phone: formData.phoneNumber,
        email: formData.organizationEmail,

        // Required fields for RegistrationData type
        username: formData.principalUsername,
        password: formData.password,
        password_confirm: formData.confirmPassword,

        // Admin details (using principal information)
        admin_username: formData.principalUsername,
        admin_email: formData.principalEmail,
        admin_first_name: formData.principalFirstName,
        admin_last_name: formData.principalLastName,
        admin_password: formData.password,
        admin_password_confirm: formData.confirmPassword,

        // Additional school information (these might be stored separately or ignored by backend)
        additional_data: {
          address: formData.address,
          total_teachers: Number(formData.totalTeachers),
          total_students: Number(formData.totalStudents),
          classes: formData.classes,
          total_sections: Number(formData.totalSections),
          has_biometric_system: formData.hasBiometricSystem,
          has_unique_ids: formData.hasUniqueIds,
          has_existing_website: formData.hasExistingWebsite,
        },
      };

      console.log('Registration payload:', registrationPayload);

      const result = await register(registrationPayload).unwrap();

      setSuccessMessage(result.message || 'Registration successful! Please login to continue.');

      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate(routes.login);
      }, 2000);
    } catch (err: unknown) {
      console.error('Registration error:', err);

      if (err && typeof err === 'object' && 'data' in err) {
        interface ErrorData {
          admin_username?: string | string[];
          admin_password?: string | string[];
          admin_password_confirm?: string | string[];
          admin_email?: string | string[];
          email?: string | string[];
          name?: string | string[];
          detail?: string | string[];
          non_field_errors?: string | string[];
        }
        const error = err as { data?: ErrorData; message?: string };

        // Handle specific field errors
        if (error.data?.admin_username) {
          setError(
            `Username: ${
              Array.isArray(error.data.admin_username)
                ? error.data.admin_username.join(', ')
                : error.data.admin_username
            }`,
          );
        } else if (error.data?.admin_password) {
          setError(
            `Password: ${
              Array.isArray(error.data.admin_password)
                ? error.data.admin_password.join(', ')
                : error.data.admin_password
            }`,
          );
        } else if (error.data?.admin_password_confirm) {
          setError(
            `Password confirmation: ${
              Array.isArray(error.data.admin_password_confirm)
                ? error.data.admin_password_confirm.join(', ')
                : error.data.admin_password_confirm
            }`,
          );
        } else if (error.data?.admin_email) {
          setError(
            `Admin Email: ${
              Array.isArray(error.data.admin_email)
                ? error.data.admin_email.join(', ')
                : error.data.admin_email
            }`,
          );
        } else if (error.data?.email) {
          setError(
            `Organization Email: ${
              Array.isArray(error.data.email) ? error.data.email.join(', ') : error.data.email
            }`,
          );
        } else if (error.data?.name) {
          setError(
            `School Name: ${
              Array.isArray(error.data.name) ? error.data.name.join(', ') : error.data.name
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
          setError(error.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

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
                <div className="col-md-10 mx-auto p-4">
                  <form onSubmit={handleRegistrationSubmit}>
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

                            <div className="mb-3">
                              <label className="form-label">Organization Email *</label>
                              <div className="input-icon position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-mail" />
                                </span>
                                <input
                                  type="email"
                                  name="organizationEmail"
                                  value={formData.organizationEmail}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Enter organization email"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Principal Information */}
                          <div className="mb-4">
                            <h5 className="text-primary mb-3">Principal Information</h5>

                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label">Principal First Name *</label>
                                <div className="input-icon position-relative">
                                  <span className="input-icon-addon">
                                    <i className="ti ti-user" />
                                  </span>
                                  <input
                                    type="text"
                                    name="principalFirstName"
                                    value={formData.principalFirstName}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter first name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">Principal Last Name *</label>
                                <div className="input-icon position-relative">
                                  <span className="input-icon-addon">
                                    <i className="ti ti-user" />
                                  </span>
                                  <input
                                    type="text"
                                    name="principalLastName"
                                    value={formData.principalLastName}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter last name"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Principal Email *</label>
                              <div className="input-icon position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-mail" />
                                </span>
                                <input
                                  type="email"
                                  name="principalEmail"
                                  value={formData.principalEmail}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Enter principal email"
                                  required
                                />
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Principal Username *</label>
                              <div className="input-icon position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-user-circle" />
                                </span>
                                <input
                                  type="text"
                                  name="principalUsername"
                                  value={formData.principalUsername}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="Enter username"
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
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                              disabled={isRegistering}
                            >
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

                          <div className="text-center">
                            <h6 className="fw-normal text-dark mb-0">
                              Already have an account?
                              <Link to={routes.login} className="hover-a">
                                {' '}
                                Sign In
                              </Link>
                            </h6>
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
    </>
  );
};

export default Register;
