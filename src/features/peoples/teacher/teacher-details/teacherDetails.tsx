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

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <TeacherBreadcrumb teacherName={`${teacher.first_name} ${teacher.last_name}`} />
            {/* /Page Header */}

            {/* Teacher Information Sidebar */}
            <TeacherSidebar teacher={teacher} />
            {/* /Teacher Information Sidebar */}

            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
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
                                {teacher.first_name} {teacher.last_name}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Username</p>
                              <p>{teacher.username}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Date of Birth</p>
                              <p>
                                {formatDate(teacher.date_of_birth)} (
                                {calculateAge(teacher.date_of_birth)} years old)
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Gender</p>
                              <p>{teacher.gender}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Qualifications</p>
                              <p>{teacher.qualifications}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Experience</p>
                              <p>{teacher.experience_years} Years</p>
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
                        <p>{teacher.email}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Phone Number</p>
                        <p>{teacher.phone}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Emergency Contact</p>
                        <p>{teacher.emergency_contact_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-dark fw-medium mb-1">Emergency Phone</p>
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
                          <p>{teacher.address || 'Not provided'}</p>
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
                            <p>{teacher.employment_type || 'Not specified'}</p>
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
                              {teacher.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Experience</p>
                            <p>{teacher.experience_years} Years</p>
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
                            <p className="mb-1 text-dark fw-medium">Bio</p>
                            <p>{teacher.bio || 'No bio provided'}</p>
                          </div>
                        </div>
                        {teacher.profile_picture_url && (
                          <div className="col-md-12">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Profile Picture</p>
                              <div className="avatar avatar-xl">
                                <img
                                  src={teacher.profile_picture_url}
                                  alt={`${teacher.first_name} ${teacher.last_name}`}
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

                {/* Documents Section - if you have documents in your teacher model */}
                {teacher.documents && teacher.documents.length > 0 && (
                  <div className="col-xxl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>Documents</h5>
                      </div>
                      <div className="card-body">
                        {teacher.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2"
                          >
                            <div className="d-flex align-items-center overflow-hidden">
                              <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                                <i className="ti ti-pdf fs-15" />
                              </span>
                              <div className="ms-2">
                                <p className="text-truncate fw-medium text-dark">
                                  {doc.name || `Document ${index + 1}`}
                                </p>
                              </div>
                            </div>
                            <Link
                              to={doc.url || '#'}
                              className="btn btn-dark btn-icon btn-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="ti ti-download" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* /Documents */}

                {/* Notes Section */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Additional Notes</h5>
                    </div>
                    <div className="card-body">
                      <p>
                        {teacher.notes ||
                          'This section contains additional information about the teacher. Any special notes, achievements, or other relevant details can be displayed here.'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* /Notes Section */}
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
