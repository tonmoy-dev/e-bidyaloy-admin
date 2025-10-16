import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import type { StudentModel } from "../models/student.model";

interface StudentSidebarProps {
  student?: StudentModel;
}

const studentSidebar = ({ student }: StudentSidebarProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });     
}

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

  const getStudentIdDisplay = (id: string | undefined) => {
    if (!id) return 'T00000000';
    return `T${id.slice(0, 8)}`;
  };

  // new: public data variables read from student model (only API-provided fields)
  const avatarSrc = student?.user?.profile_picture_url || "assets/img/students/student-01.jpg";
  const status = student?.status ?? (student?.user?.is_active ? 'active' : 'inactive');
  const statusBadgeClass = status === 'active' ? 'badge-soft-success' : 'badge-soft-danger';
  const displayName = student
    ? (student.user.full_name || `${student.user.first_name || ''} ${student.user.last_name || ''}`.trim() || 'Student Name')
    : 'Student Name';
  const displayStudentId = getStudentIdDisplay(student?.student_id);
  const displayRoll = student?.roll_number ?? '-';
  const displayGender = (student?.gender || student?.user?.gender) ?? '-';
  const dobSource = student?.date_of_birth || student?.user?.date_of_birth;
  const displayDob = dobSource ? formatDate(dobSource) : '-';
  const displayAge = dobSource ? calculateAge(dobSource) : (student?.age ?? '-');
  const displayBloodGroup = student?.blood_group ?? '-';
  const displayPhone = student?.user?.phone ?? student?.phone ?? '-';
  const displayEmail = student?.user?.email ?? student?.email ?? '-';
  const displayClass = (student?.class_name) ?? '-';
  const displaySection = (student?.section_name) ?? '-';
  // ...you can add more derived vars here when needed...

  const studentName = displayName;
  const studentId = displayStudentId;

  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      <div className="stickybar pb-4">
        <div className="card border-white">
          <div className="card-header">
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                <ImageWithBasePath
                  src={avatarSrc}
                  className="img-fluid"
                  alt="img"
                />
              </div>
              <div className="overflow-hidden">
                <span className={`badge ${statusBadgeClass} d-inline-flex align-items-center mb-1`}>
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {status ?? 'inactive'}
                </span>
                <h5 className="mb-1 text-truncate">{studentName}</h5>
                <p className="text-primary">{studentId}</p>
              </div>
            </div>
          </div>
          {/* Basic Information */}
          <div className="card-body">
            <h5 className="mb-3">Basic Information</h5>
            <dl className="row mb-0">
              <dt className="col-6 fw-medium text-dark mb-3">Roll No</dt>
              <dd className="col-6 mb-3" title={displayRoll}>{displayRoll}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
              <dd className="col-6 mb-3" title={displayGender}>{displayGender}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
              <dd className="col-6 mb-3">{displayDob}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Age</dt>
              <dd className="col-6 mb-3">{displayAge}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
              <dd className="col-6 mb-3">{displayBloodGroup}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Class</dt>
              <dd className="col-6 mb-3">{displayClass}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Section</dt>
              <dd className="col-6 mb-3">{displaySection}</dd>

              <dt className="col-6 fw-medium text-dark mb-3">Religion</dt>
              <dd className="col-6 mb-3">{student?.user?.preferences?.religion ?? '-'}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Category</dt>
              <dd className="col-6 mb-3">{student?.user?.preferences?.category ?? '-'}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Mother tongue</dt>
              <dd className="col-6 mb-3">{student?.user?.preferences?.mother_tongue ?? '-'}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Language</dt>
              <dd className="col-6 mb-3">
                {Array.isArray(student?.user?.preferences?.languages)
                  ? student!.user!.preferences!.languages.map((l: string, i: number) => (
                      <span key={i} className="badge badge-light text-dark me-2">{l}</span>
                    ))
                  : (student?.user?.preferences?.languages ? <span className="badge badge-light text-dark">{student!.user!.preferences!.languages}</span> : <span>-</span>)
                }
              </dd>
            </dl>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_fees_collect"
              className="btn btn-primary btn-sm w-100"
            >
              Add Fees
            </Link>
          </div>
          {/* /Basic Information */}
        </div>
        {/* Primary Contact Info */}
        <div className="card border-white">
          <div className="card-body">
            <h5 className="mb-3">Primary Contact Info</h5>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-phone" />
              </span>
              <div>
                <span className="text-dark fw-medium mb-1">Phone Number</span>
                <p>{displayPhone}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-mail" />
              </span>
              <div>
                <span className="text-dark fw-medium mb-1">Email Address</span>
                <p>{displayEmail}</p>
              </div>
            </div>
          </div>
        </div>
        {/* /Primary Contact Info */}
        {/* Sibiling Information */}
        <div className="card border-white">
          <div className="card-body">
            <h5 className="mb-3">Sibiling Information</h5>
            <div className="d-flex align-items-center bg-light-300 rounded p-3 mb-3">
              <span className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/students/student-06.jpg"
                  className="img-fluid rounded"
                  alt="img"
                />
              </span>
              <div className="ms-2">
                <h5 className="fs-14">Ralph Claudia</h5>
                <p>III, B</p>
              </div>
            </div>
            <div className="d-flex align-items-center bg-light-300 rounded p-3">
              <span className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/students/student-07.jpg"
                  className="img-fluid rounded"
                  alt="img"
                />
              </span>
              <div className="ms-2">
                <h5 className="fs-14">Julie Scott</h5>
                <p>V, A</p>
              </div>
            </div>
          </div>
        </div>
        {/* /Sibiling Information */}
        {/* Transport Information */}
        <div className="card border-white mb-0">
          <div className="card-body pb-1">
            <ul className="nav nav-tabs nav-tabs-bottom mb-3">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#hostel"
                  data-bs-toggle="tab"
                >
                  Hostel
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#transport" data-bs-toggle="tab">
                  Transportation
                </Link>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="hostel">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-building-fortress fs-16" />
                  </span>
                  <div>
                    <h6 className="fs-14 mb-1">{student?.hostel_required ? (student?.organization_name ?? 'Hostel') : 'No Hostel'}</h6>
                    <p className="text-primary">{student?.hostel_required ? `Room No : ${student?.user?.preferences?.hostel_room ?? 'N/A'}` : ''}</p>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="transport">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                    <i className="ti ti-bus fs-16" />
                  </span>
                  <div>
                    <span className="fs-12 mb-1">Route</span>
                    <p className="text-dark">{student?.transport_required ? (student?.user?.preferences?.route_name ?? 'N/A') : 'No Transport'}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <span className="fs-12 mb-1">Bus Number</span>
                      <p className="text-dark">{student?.user?.preferences?.bus_number ?? '-'}</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <span className="fs-12 mb-1">Pickup Point</span>
                      <p className="text-dark">{student?.user?.preferences?.pickup_point ?? '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Transport Information */}
      </div>
    </div>
  );
};

export default studentSidebar;
