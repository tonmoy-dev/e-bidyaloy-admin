import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../core/constants/api';
import { all_routes } from '../../router/all_routes';
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from './profileHooks';

type PasswordField = 'oldPassword' | 'newPassword' | 'confirmPassword' | 'currentPassword';

// Helper function to get full image URL
const getImageUrl = (path?: string) => {
  if (!path) return 'assets/img/profiles/avatar-27.jpg';
  // If path already starts with http/https, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // If path starts with /, remove it to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

const Profile = () => {
  const route = all_routes;
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    address: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState<string>('');

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        phone: user.phone || '',
        email: user.email || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        address: user.address || '',
      });
      // Set current profile image URL
      const imageUrl = getImageUrl(user.profile_picture_url);
      setCurrentProfileImageUrl(imageUrl);
      // Reset preview image when user data changes (after successful update)
      setPreviewImage('');
      setProfileImage(null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setPreviewImage('');
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    // Append profile image if a new one was selected
    if (profileImage) {
      formDataToSend.append('profile_picture_url', profileImage);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      await updateProfile(formDataToSend).unwrap();
      alert('Profile updated successfully!');

      // Reset the file input
      const fileInput = document.querySelector('#profile_picture_input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Close modal
      const modal = document.getElementById('edit_personal_information');
      const backdrop = document.querySelector('.modal-backdrop');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      alert('New password and confirm password do not match!');
      return;
    }

    try {
      await changePassword(passwordData).unwrap();
      alert('Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
      // Close modal
      const modal = document.getElementById('change_password');
      const backdrop = document.querySelector('.modal-backdrop');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    }
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Get the display image (preview if exists, otherwise current profile image)
  const displayImage = previewImage || currentProfileImageUrl;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching profile data</div>;
  }

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Profile</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={route.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Settings</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Profile
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
                >
                  <Link to="#" className="btn btn-outline-light bg-white btn-icon me-1">
                    <i className="ti ti-refresh" />
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className="d-md-flex d-block mt-3">
            <div className="settings-right-sidebar me-md-3 border-0">
              <div className="card">
                <div className="card-header">
                  <h5>Personal Information</h5>
                </div>
                <div className="card-body">
                  <div className="settings-profile-upload">
                    <span className="profile-pic">
                      {/* Use img tag instead of ImageWithBasePath for better control */}
                      <img
                        src={currentProfileImageUrl}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-fill ps-0 border-0">
              <div className="d-md-flex">
                <div className="flex-fill">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Personal Information</h5>
                      <Link
                        to="#"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_personal_information"
                      >
                        <i className="ti ti-edit me-2" />
                        Edit
                      </Link>
                    </div>
                    <div className="card-body pb-0">
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.first_name}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label">Middle Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.middle_name}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.last_name}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control"
                            value={formData.date_of_birth}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <label className="form-label">Gender</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.gender}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.address}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Password</h5>
                      <Link
                        to="#"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#change_password"
                      >
                        Change
                      </Link>
                    </div>
                    <div className="card-body pb-0">
                      <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <div className="pass-group d-flex">
                          <input
                            type={passwordVisibility.currentPassword ? 'text' : 'password'}
                            className="pass-input form-control"
                            value="••••••••"
                            readOnly
                          />
                          <span
                            className={`ti toggle-passwords ${
                              passwordVisibility.currentPassword ? 'ti-eye' : 'ti-eye-off'
                            }`}
                            onClick={() => togglePasswordVisibility('currentPassword')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div className="modal fade" id="edit_personal_information">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Personal Information</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Profile Picture</label>
                      {displayImage && (
                        <div className="mb-2">
                          <img
                            src={displayImage}
                            alt="Preview"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        id="profile_picture_input"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {previewImage && (
                        <small className="text-muted d-block mt-1">New image selected</small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        placeholder="Enter Middle Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className="modal fade" id="change_password">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Change Password</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <div className="pass-group d-flex">
                        <input
                          name="old_password"
                          type={passwordVisibility.oldPassword ? 'text' : 'password'}
                          className="pass-input form-control"
                          value={passwordData.old_password}
                          onChange={handlePasswordChange}
                        />
                        <span
                          className={`ti toggle-passwords ${
                            passwordVisibility.oldPassword ? 'ti-eye' : 'ti-eye-off'
                          }`}
                          onClick={() => togglePasswordVisibility('oldPassword')}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="pass-group d-flex">
                        <input
                          name="new_password"
                          type={passwordVisibility.newPassword ? 'text' : 'password'}
                          className="pass-input form-control"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                        />
                        <span
                          className={`ti toggle-passwords ${
                            passwordVisibility.newPassword ? 'ti-eye' : 'ti-eye-off'
                          }`}
                          onClick={() => togglePasswordVisibility('newPassword')}
                        />
                      </div>
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Confirm Password</label>
                      <div className="pass-group d-flex">
                        <input
                          name="new_password_confirm"
                          type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                          className="pass-input form-control"
                          value={passwordData.new_password_confirm}
                          onChange={handlePasswordChange}
                        />
                        <span
                          className={`ti toggle-passwords ${
                            passwordVisibility.confirmPassword ? 'ti-eye' : 'ti-eye-off'
                          }`}
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Changing...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
