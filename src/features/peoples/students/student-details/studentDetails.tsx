import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'
import StudentModals from '../studentModals'
import StudentSidebar from './studentSidebar'
import StudentBreadcrumb from './studentBreadcrumb'
import { useStudentById } from '../hooks/useStudentById'
import type { studentModel } from '../models/student.model'



const StudentDetails = () => {
    const routes = all_routes
    const location = useLocation()
    const [studentId, setStudentId] = useState<string | null>(null);
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');
      setStudentId(id);
    }, [location]);
    const { studentDetails, isLoading, isError, error, refetch } = useStudentById(studentId);

    if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '400px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading Student details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
   
   // Error state
    if (isError || !studentDetails) {
      return (
        <div className="page-wrapper">
          <div className="content">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Student Details</h4>
              <p>
                {error && typeof error === 'object' && 'message' in error
                  ? (error as any).message
                  : 'Failed to load student details. Please try again.'}
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-danger" onClick={() => refetch()}>
                  Retry
                </button>
                <Link to={routes.studentList} className="btn btn-outline-secondary">
                  Back to Students
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const student: studentModel = studentDetails;

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
        <StudentBreadcrumb
          studentName={
            student.user?.full_name || 
            `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.trim() ||
            'Unknown Student'
          }
          studentId={student.id || 'N/A'}
        />
        {/* /Page Header */}
      </div>
      <div className="row">
        {/* Student Information */}
        <StudentSidebar student={student} />
        {/* /Student Information */}
        <div className="col-xxl-9 col-xl-8">
          <div className="row">
            <div className="col-md-12">
              {/* List */}
              <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                <li>
                  <Link
                    to={`${routes.studentDetail}?id=${student.student_id}`}
                    className="nav-link active"
                  >
                    <i className="ti ti-school me-2" />
                    Student Details
                  </Link>
                </li>
                <li>
                  <Link to={routes.studentTimeTable} className="nav-link">
                    <i className="ti ti-table-options me-2" />
                    Time Table
                  </Link>
                </li>
                <li>
                  <Link to={routes.studentLeaves} className="nav-link">
                    <i className="ti ti-calendar-due me-2" />
                    Leave &amp; Attendance
                  </Link>
                </li>
                <li>
                  <Link to={routes.studentFees} className="nav-link">
                    <i className="ti ti-report-money me-2" />
                    Fees
                  </Link>
                </li>
                <li>
                  <Link to={routes.studentResult} className="nav-link">
                    <i className="ti ti-bookmark-edit me-2" />
                    Exam &amp; Results
                  </Link>
                </li>
                <li>
                  <Link to={routes.studentLibrary} className="nav-link">
                    <i className="ti ti-books me-2" />
                    Library
                  </Link>
                </li>
              </ul>
              {/* /List */}
              {/* Parents Information */}
              <div className="card">
                <div className="card-header">
                  <h5>Gaurdian Information</h5>
                </div>
                <div className="card-body">
                  <div className="border rounded p-3 pb-0 mb-3">
                    <div className="row">
                      <div className="col-sm-6 col-lg-4">
                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-lg flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/parents/parent-13.jpg"
                              className="img-fluid rounded"
                              alt="img"
                            />
                          </span>
                          <div className="ms-2 overflow-hidden">
                            <h6 className="text-truncate">{student?.guardian_name || 'Unknown'}</h6>
                            <p className="text-primary">{student?.guardian_relationship || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-4">
                        <div className="mb-3">
                          <p className="text-dark fw-medium mb-1">Phone</p>
                          <p>{student?.guardian_phone || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="mb-3 overflow-hidden me-3">
                            <p className="text-dark fw-medium mb-1">Email</p>
                            <p className="text-truncate">{student?.guardian_email || 'Unknown'}</p>
                          </div>
                          <Link
                            to="#"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            aria-label="Print"
                            data-bs-original-title="Reset Password"
                            className="btn btn-dark btn-icon btn-sm mb-3"
                          >
                            <i className="ti ti-lock-x" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Parents Information */}
            </div>
            {/* Documents */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5>Documents</h5>
                </div>
                <div className="card-body">
                  <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                        <i className="ti ti-pdf fs-15" />
                      </span>
                      <div className="ms-2">
                        <p className="text-truncate fw-medium text-dark">
                          BirthCertificate.pdf
                        </p>
                      </div>
                    </div>
                    <Link to="#" className="btn btn-dark btn-icon btn-sm">
                      <i className="ti ti-download" />
                    </Link>
                  </div>
                  <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                        <i className="ti ti-pdf fs-15" />
                      </span>
                      <div className="ms-2">
                        <p className="text-truncate fw-medium text-dark">
                          Transfer Certificate.pdf
                        </p>
                      </div>
                    </div>
                    <Link to="#" className="btn btn-dark btn-icon btn-sm">
                      <i className="ti ti-download" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Documents */}
            {/* Address */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5>Address</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-map-pin-up" />
                    </span>
                    <div>
                      <p>{student.user?.address ? "Address" : "No Address Available"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Address */}
            {/* Medical History */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5>Medical History</h5>
                </div>
                <div className="card-body pb-1">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">
                          Known Allergies
                        </p>
                        <span className="badge bg-light text-dark">Rashes</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">Medications</p>
                        <p>-</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Medical History */}
            {/* Other Info */}
            <div className="col-xxl-12">
              <div className="card">
                <div className="card-header">
                  <h5>Other Info</h5>
                </div>
                <div className="card-body">
                  <p>
                    Depending on the specific needs of your organization or
                    system, additional information may be collected or tracked.
                    It's important to ensure that any data collected complies
                    with privacy regulations and policies to protect students'
                    sensitive information.
                  </p>
                </div>
              </div>
            </div>
            {/* /Other Info */}
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
  <StudentModals />
</>

  )
}

export default StudentDetails