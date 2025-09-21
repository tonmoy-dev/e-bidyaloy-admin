import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { all_routes } from '../../../router/all_routes';
import { useTeacherById } from '../hooks/useTeacherById';
import type { TeacherModel } from '../models/teacher.model';
import TeacherModal from '../teacherModal';
import TeacherBreadcrumb from './teacherBreadcrumb';
import TeacherSidebar from './teacherSidebar';

const TeacherDetails = () => {
  const routes = all_routes;
  const location = useLocation();
  const [teacherId, setTeacherId] = useState<string | null>(null);

  // Extract teacher ID from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (id) {
      setTeacherId(id);
    }
  }, [location]);

  // Fetch teacher data
  const { isLoading, teacherDetails, isError, error, refetch } = useTeacherById(teacherId);

  // Loading state
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '400px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading teacher details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !teacherDetails) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Teacher Details</h4>
            <p>
              {error && typeof error === 'object' && 'message' in error
                ? (error as any).message
                : 'Failed to load teacher details. Please try again.'}
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={() => refetch()}>
                Retry
              </button>
              <Link to={routes.teacherList} className="btn btn-outline-secondary">
                Back to Teachers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const teacher: TeacherModel = teacherDetails;

  // Helper functions for data formatting
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (dateString: string) => {
    try {
      const birthDate = new Date(dateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'N/A';
    }
  };

  const formatEmploymentType = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Full Time';
      case 'part_time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      default:
        return type || 'Not specified';
    }
  };

  const formatGender = (gender: string) => {
    return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified';
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <TeacherBreadcrumb
              teacherName={
                `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() ||
                'Unknown Teacher'
              }
              teacherId={teacherId}
            />
            {/* /Page Header */}

            {/* Teacher Information Sidebar */}
            <TeacherSidebar teacher={teacher} />
            {/* /Teacher Information Sidebar */}

            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end mb-3">
                    <button
                      className={`btn ${teacher.is_active ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => {
                        // Add your toggle active/inactive logic here
                        console.log('Toggle teacher status');
                      }}
                    >
                      <i
                        className={`ti ${teacher.is_active ? 'ti-user-off' : 'ti-user-check'} me-2`}
                      />
                      {teacher.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                  {/* /Action Buttons */}

                  {/* Navigation Tabs */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link
                        to={`${routes.teacherDetails}?id=${teacherId}`}
                        className="nav-link active"
                      >
                        <i className="ti ti-school me-2" />
                        Teacher Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teachersRoutine}?id=${teacherId}`} className="nav-link">
                        <i className="ti ti-table-options me-2" />
                        Routine
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLeaves}?id=${teacherId}`} className="nav-link">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherSalary}?id=${teacherId}`} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Salary
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLibrary}?id=${teacherId}`} className="nav-link">
                        <i className="ti ti-bookmark-edit me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /Navigation Tabs */}

                  {/* Profile Details */}
                  <div className="card">
                    <div className="card-header">
                      <h5>Profile Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="border rounded p-3 pb-0">
                        <div className="row">
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Full Name</p>
                              <p>
                                {teacher.user?.first_name || ''} {teacher.user?.last_name || ''}{' '}
                                {teacher.user?.middle_name || ''}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Username</p>
                              <p>{teacher.user?.username || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Date of Birth</p>
                              <p>
                                {teacher.user?.date_of_birth ? (
                                  <>
                                    {formatDate(teacher.user.date_of_birth)} (
                                    {calculateAge(teacher.user.date_of_birth)} years old)
                                  </>
                                ) : (
                                  'Not provided'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Gender</p>
                              <p>{formatGender(teacher.user?.gender || '')}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Qualifications</p>
                              <p>{teacher.qualifications || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Experience</p>
                              <p>{teacher.experience_years || 0} Years</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Employee ID</p>
                              <p>{teacher.employee_id || 'Not assigned'}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Organization</p>
                              <p>{teacher.organization_name || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Max Classes Per Week</p>
                              <p>{teacher.max_classes_per_week || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Profile Details */}
                </div>

                {/* Contact Information */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Contact Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Email Address</p>
                        <p>{teacher.user?.email || 'Not provided'}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Phone Number</p>
                        <p>{teacher.user?.phone || 'Not provided'}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Emergency Contact Name</p>
                        <p>{teacher.emergency_contact_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-dark fw-medium mb-1">Emergency Contact Phone</p>
                        <p>{teacher.emergency_contact_phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Contact Information */}

                {/* Address */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Address</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <i className="ti ti-map-pin-up" />
                        </span>
                        <div>
                          <p className="text-dark fw-medium mb-1">Current Address</p>
                          <p>{teacher.user?.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Address */}

                {/* Employment Details */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Employment Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Department</p>
                            <p>{teacher.department || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Designation</p>
                            <p>{teacher.designation || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Employment Type</p>
                            <p>{formatEmploymentType(teacher.employment_type)}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Hire Date</p>
                            <p>
                              {teacher.hire_date ? formatDate(teacher.hire_date) : 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Salary</p>
                            <p>
                              {teacher.salary
                                ? `${teacher.salary} ${teacher.salary_currency || 'USD'}`
                                : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Bank Account</p>
                            <p>{teacher.bank_account_number || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Teaching License</p>
                            <p>{teacher.teaching_license || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">License Expiry</p>
                            <p>
                              {teacher.license_expiry_date
                                ? formatDate(teacher.license_expiry_date)
                                : 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Employment Details */}

                {/* Status Information */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Status Information</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Current Status</p>
                            <span
                              className={`badge ${
                                teacher.is_active ? 'badge-soft-success' : 'badge-soft-danger'
                              }`}
                            >
                              <i className="ti ti-circle-filled fs-5 me-1"></i>
                              {teacher.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">User Status</p>
                            <span
                              className={`badge ${
                                teacher.user?.is_active ? 'badge-soft-success' : 'badge-soft-danger'
                              }`}
                            >
                              <i className="ti ti-circle-filled fs-5 me-1"></i>
                              {teacher.user?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Date Joined</p>
                            <p>
                              {teacher.user?.date_joined
                                ? formatDate(teacher.user.date_joined)
                                : 'Not available'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Last Login</p>
                            <p>
                              {teacher.user?.last_login_at
                                ? formatDate(teacher.user.last_login_at)
                                : 'Never logged in'}
                            </p>
                          </div>
                        </div>
                        {teacher.termination_date && (
                          <>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="mb-1 text-dark fw-medium">Termination Date</p>
                                <p>{formatDate(teacher.termination_date)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <p className="mb-1 text-dark fw-medium">Termination Reason</p>
                                <p>{teacher.termination_reason || 'Not specified'}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Status Information */}

                {/* Additional Information */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Additional Information</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Specialization</p>
                            <p>{teacher.specialization || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">User Type</p>
                            <span className="badge badge-soft-info">
                              {teacher.user?.user_type || 'Not specified'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Email Verified</p>
                            <span
                              className={`badge ${
                                teacher.user?.email_verified_at
                                  ? 'badge-soft-success'
                                  : 'badge-soft-warning'
                              }`}
                            >
                              {teacher.user?.email_verified_at ? 'Verified' : 'Not Verified'}
                            </span>
                          </div>
                        </div>
                        {teacher.user?.profile_picture_url && (
                          <div className="col-md-12">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Profile Picture</p>
                              <div className="avatar avatar-xl">
                                <img
                                  src={teacher.user.profile_picture_url}
                                  alt={`${teacher.user?.first_name || ''} ${
                                    teacher.user?.last_name || ''
                                  }`}
                                  className="rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = '/assets/img/default-avatar.png';
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Additional Information */}

                {/* Specializations Section */}
                {teacher.specializations && teacher.specializations.length > 0 && (
                  <div className="col-xxl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>Specializations</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-wrap gap-2">
                          {teacher.specializations.map((specialization, index) => (
                            <span key={index} className="badge badge-soft-primary">
                              {specialization}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* /Specializations */}

                {/* User Roles Section */}
                {teacher.user?.roles && teacher.user.roles.length > 0 && (
                  <div className="col-xxl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>User Roles</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-wrap gap-2">
                          {teacher.user.roles.map((role, index) => (
                            <span key={index} className="badge badge-soft-secondary">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* /User Roles */}

                {/* System Information */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>System Information</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Teacher ID</p>
                            <p className="font-monospace">{teacher.id}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">User ID</p>
                            <p className="font-monospace">{teacher.user?.id}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Organization ID</p>
                            <p className="font-monospace">{teacher.organization}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Created At</p>
                            <p>
                              {teacher.created_at
                                ? formatDate(teacher.created_at)
                                : 'Not available'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Updated At</p>
                            <p>
                              {teacher.updated_at
                                ? formatDate(teacher.updated_at)
                                : 'Not available'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Age (Calculated)</p>
                            <p>{teacher.age || 'Not calculated'} years</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /System Information */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <TeacherModal />
    </>
  );
};

export default TeacherDetails;
