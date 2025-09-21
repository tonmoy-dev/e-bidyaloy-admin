import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import type { TeacherModel } from '../models/teacher.model';

interface TeacherSidebarProps {
  teacher?: TeacherModel;
}

const TeacherSidebar = ({ teacher }: TeacherSidebarProps) => {
  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  // Helper function to calculate age
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to get teacher ID display
  const getTeacherIdDisplay = (id: string | undefined) => {
    if (!id) return 'T00000000';
    return `T${id.slice(0, 8)}`;
  };

  // Default fallback values
  const teacherName = teacher
    ? `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() || 'N/A'
    : 'N/A';

  const teacherImage = teacher?.user?.profile_picture_url || 'assets/img/teachers/teacher-01.jpg';
  const teacherId = getTeacherIdDisplay(teacher?.id);
  const joinDate = formatDate(teacher?.user?.date_joined || null);
  const department = teacher?.department || 'N/A';
  const designation = teacher?.designation || 'N/A';
  const gender = teacher?.user?.gender
    ? teacher.user.gender.charAt(0).toUpperCase() + teacher.user.gender.slice(1)
    : 'N/A';
  const phone = teacher?.user?.phone || 'N/A';
  const email = teacher?.user?.email || 'N/A';
  const qualifications = teacher?.qualifications || 'N/A';
  const experienceYears = teacher?.experience_years || 0;
  const specialization = teacher?.specialization || 'N/A';
  const emergencyContact = teacher?.emergency_contact_name || 'N/A';
  const emergencyPhone = teacher?.emergency_contact_phone || 'N/A';
  const employmentType = teacher?.employment_type
    ? teacher.employment_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'N/A';
  const maxClasses = teacher?.max_classes_per_week || 0;
  const age = calculateAge(teacher?.user?.date_of_birth || null);

  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      <div className="stickytopbar pb-4">
        <div className="card border-white">
          <div className="card-header">
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                <ImageWithBasePath src={teacherImage} className="img-fluid" alt="Teacher Profile" />
              </div>
              <div>
                <h5 className="mb-1 text-truncate" title={teacherName}>
                  {teacherName}
                </h5>
                <p className="text-primary mb-1">{teacherId}</p>
                <p>Joined: {joinDate}</p>
                {teacher?.is_active ? (
                  <span className="badge badge-soft-success">Active</span>
                ) : (
                  <span className="badge badge-soft-danger">Inactive</span>
                )}
              </div>
            </div>
          </div>
          <div className="card-body">
            <h5 className="mb-3">Basic Information</h5>
            <dl className="row mb-0">
              <dt className="col-6 fw-medium text-dark mb-3">Department</dt>
              <dd className="col-6 mb-3" title={department}>
                {department}
              </dd>

              <dt className="col-6 fw-medium text-dark mb-3">Designation</dt>
              <dd className="col-6 mb-3" title={designation}>
                {designation}
              </dd>

              <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
              <dd className="col-6 mb-3">{gender}</dd>

              <dt className="col-6 fw-medium text-dark mb-3">Age</dt>
              <dd className="col-6 mb-3">{age > 0 ? `${age} years` : 'N/A'}</dd>

              <dt className="col-6 fw-medium text-dark mb-3">Experience</dt>
              <dd className="col-6 mb-3">
                {experienceYears > 0 ? `${experienceYears} years` : 'N/A'}
              </dd>

              <dt className="col-6 fw-medium text-dark mb-3">Employment Type</dt>
              <dd className="col-6 mb-3">{employmentType}</dd>

              <dt className="col-6 fw-medium text-dark mb-3">Max Classes/Week</dt>
              <dd className="col-6 mb-3">{maxClasses}</dd>

              <dt className="col-6 fw-medium text-dark mb-0">Specialization</dt>
              <dd className="col-6 mb-0" title={specialization}>
                {specialization !== 'N/A' ? (
                  <span className="badge badge-light text-dark">{specialization}</span>
                ) : (
                  'N/A'
                )}
              </dd>
            </dl>
          </div>
        </div>

        <div className="card border-white">
          <div className="card-body">
            <h5 className="mb-3">Contact Information</h5>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-phone" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Phone Number</span>
                <p className="mb-0" title={phone}>
                  {phone}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-mail" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Email Address</span>
                <p className="mb-0 text-break" title={email}>
                  {email}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-map-pin" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Address</span>
                <p className="mb-0" title={teacher?.user?.address || 'N/A'}>
                  {teacher?.user?.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-white">
          <div className="card-body">
            <h5 className="mb-3">Emergency Contact</h5>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-user-exclamation" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Contact Name</span>
                <p className="mb-0">{emergencyContact}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-phone-call" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Phone Number</span>
                <p className="mb-0">{emergencyPhone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-white">
          <div className="card-body pb-1">
            <h5 className="mb-3">Professional Details</h5>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center flex-grow-1">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-certificate" />
                </span>
                <div className="flex-grow-1">
                  <span className="text-dark fw-medium d-block mb-1">Qualifications</span>
                  <p className="mb-0" title={qualifications}>
                    {qualifications}
                  </p>
                </div>
              </div>
            </div>

            {teacher?.teaching_license && (
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-license" />
                </span>
                <div className="flex-grow-1">
                  <span className="text-dark fw-medium d-block mb-1">Teaching License</span>
                  <p className="mb-0">{teacher.teaching_license}</p>
                  {teacher.license_expiry_date && (
                    <small className="text-muted">
                      Expires: {formatDate(teacher.license_expiry_date)}
                    </small>
                  )}
                </div>
              </div>
            )}

            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-calendar" />
              </span>
              <div className="flex-grow-1">
                <span className="text-dark fw-medium d-block mb-1">Hire Date</span>
                <p className="mb-0">{formatDate(teacher?.hire_date || null)}</p>
              </div>
            </div>
          </div>
        </div>

        {teacher?.salary && (
          <div className="card border-white">
            <div className="card-body pb-1">
              <h5 className="mb-3">Salary Information</h5>
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-currency-dollar" />
                </span>
                <div className="flex-grow-1">
                  <span className="text-dark fw-medium d-block mb-1">Salary</span>
                  <p className="mb-0">
                    {teacher.salary_currency || 'USD'} {teacher.salary?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card border-white mb-0">
          <div className="card-body pb-1">
            <ul className="nav nav-tabs nav-tabs-bottom mb-3">
              <li className="nav-item">
                <Link className="nav-link active" to="#organization" data-bs-toggle="tab">
                  Organization
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#specializations" data-bs-toggle="tab">
                  Specializations
                </Link>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="organization">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-building fs-16" />
                  </span>
                  <div>
                    <h6 className="mb-1">Organization</h6>
                    <p className="text-primary mb-0">{teacher?.organization_name || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="specializations">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-star fs-16" />
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Areas of Expertise</h6>
                    {teacher?.specializations && teacher.specializations.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {teacher.specializations.map((spec: any, index: number) => (
                          <span key={index} className="badge badge-light text-dark">
                            {spec}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No specializations listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
