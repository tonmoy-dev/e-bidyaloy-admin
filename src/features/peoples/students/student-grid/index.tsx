/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommonSelect from '../../../../core/common/commonSelect';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from '../../../../core/common/selectoption/selectoption';
import TooltipOption from '../../../../core/common/tooltipOption';
import { all_routes } from '../../../router/all_routes';
import { useStudentMutations } from '../hooks/useStudentMutations';
import { useStudents } from '../hooks/useStudents';
import StudentModals from '../studentModals';
import StudentTypeModal from '../StudentTypeModal';

const StudentGrid = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [currentPage] = useState(1);
  const [filters] = useState({
    name: '',
    class: '',
    section: '',
    gender: '',
    status: '',
  });

  // API hooks
  const { isLoading, students, isError, refetch } = useStudents(currentPage);
  const { deleteStudent, isDeleteSuccess } = useStudentMutations();

  // Transform API data for grid
  const gridData = useMemo(() => {
    if (!students?.results) return [];
    return students.results.map((s: any) => ({
      key: s.id ?? s.student_id ?? s.admission_number ?? Math.random().toString(36).slice(2),
      student_id: s.student_id ?? s.admission_number ?? '',
      admission_number: s.admission_number ?? s.student_id ?? '',
      roll_number: s.roll_number ?? '',
      name: s.user?.full_name || `${s.user?.first_name ?? ''} ${s.user?.last_name ?? ''}`.trim(),
      class: s.class_name || s.grade_name || '',
      section: s.section_name || '',
      gender: s.user?.gender || '',
      status: s.status || 'active',
      admission_date: s.admission_date || s.user?.date_joined || '',
      profile_picture_url: s.user?.profile_picture_url || 'assets/img/students/student-01.jpg',
      raw: s,
      studentId: s.id,
    }));
  }, [students]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return gridData.filter((student) => {
      const matchesName =
        !filters.name || student.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesClass =
        !filters.class || student.class.toLowerCase().includes(filters.class.toLowerCase());
      const matchesSection =
        !filters.section || student.section.toLowerCase().includes(filters.section.toLowerCase());
      const matchesGender = !filters.gender || student.gender === filters.gender;
      const matchesStatus = !filters.status || student.status === filters.status;

      return matchesName && matchesClass && matchesSection && matchesGender && matchesStatus;
    });
  }, [gridData, filters]);

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };

  // TODO: Implement filtering functionality
  // const handleFilterChange = (field: string, value: any) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [field]: value?.value || value || "",
  //   }));
  // };

  // const handleResetFilters = () => {
  //   setFilters({
  //     name: "",
  //     class: "",
  //     section: "",
  //     gender: "",
  //     status: "",
  //   });
  // };

  // Ensure refetch on successful deletion
  useEffect(() => {
    if (isDeleteSuccess) {
      refetch();
    }
  }, [isDeleteSuccess, refetch]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Students Grid
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              <div className="mb-2 me-2">
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#student_type_modal"
                >
                  <i className="ti ti-category me-2" />
                  Student Type
                </button>
              </div>

              <div className="mb-2">
                <Link to={routes.addStudent} className="btn btn-primary d-flex align-items-center">
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Student
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Filter */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Students Grid</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </Link>
                <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={allClass[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className="select"
                              options={allSection}
                              defaultValue={allSection[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <CommonSelect
                              className="select"
                              options={names}
                              defaultValue={names[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <CommonSelect
                              className="select"
                              options={gender}
                              defaultValue={gender[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={status}
                              defaultValue={status[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link to="#" className="btn btn-light me-3">
                        Reset
                      </Link>
                      <Link
                        to={routes.studentGrid}
                        className="btn btn-primary"
                        onClick={handleApplyClick}
                      >
                        Apply
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={routes.studentList}
                  className="btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link to={routes.studentGrid} className="active btn btn-icon btn-sm primary-hover">
                  <i className="ti ti-grid-dots" />
                </Link>
              </div>
              <div className="dropdown mb-3">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort by A-Z{' '}
                </Link>
                <ul className="dropdown-menu p-3">
                  <li>
                    <Link to="#" className="dropdown-item rounded-1 active">
                      Ascending
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Descending
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Recently Viewed
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Recently Added
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Filter */}
          {/* Loading State */}
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading students...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Students</h4>
              <p>Failed to load students. Please try again.</p>
              <button className="btn btn-outline-danger" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {/* Students Grid */}
          {!isLoading && !isError && (
            <div className="row">
              {filteredData.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-5">
                    <h5>No students found</h5>
                    <p className="text-muted">Try adjusting your filters or add some students.</p>
                    <Link to={routes.addStudent} className="btn btn-primary">
                      Add Student
                    </Link>
                  </div>
                </div>
              ) : (
                filteredData.map((student: any) => (
                  <div key={student.key} className="col-xxl-3 col-xl-4 col-md-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <Link
                          to={`${routes.studentDetail}?id=${student.studentId}`}
                          className="link-primary"
                        >
                          {student.admission_number || student.studentId || 'N/A'}
                        </Link>
                        <div className="d-flex align-items-center">
                          <span
                            className={`badge ${
                              student.status === 'active'
                                ? 'badge-soft-success'
                                : 'badge-soft-danger'
                            } d-inline-flex align-items-center me-1`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {student.status || 'Active'}
                          </span>
                          <div className="dropdown">
                            <Link
                              to="#"
                              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ti ti-dots-vertical fs-14" />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-right p-3">
                              <li>
                                <Link
                                  className="dropdown-item rounded-1"
                                  to={`${routes.studentDetail}?id=${student.studentId}`}
                                >
                                  <i className="ti ti-menu me-2" />
                                  View Student
                                </Link>
                              </li>
                              <li>
                                <Link className="dropdown-item rounded-1" to={routes.editStudent}>
                                  <i className="ti ti-edit-circle me-2" />
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item rounded-1"
                                  to={routes.studentPromotion}
                                >
                                  <i className="ti ti-arrow-ramp-right-2 me-2" />
                                  Promote Student
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item rounded-1"
                                  to="#"
                                  onClick={() => handleDeleteStudent(student.studentId)}
                                >
                                  <i className="ti ti-trash-x me-2" />
                                  Delete
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="bg-light-300 rounded-2 p-3 mb-3">
                          <div className="d-flex align-items-center">
                            <Link
                              to={`${routes.studentDetail}?id=${student.studentId}`}
                              className="avatar avatar-lg flex-shrink-0"
                            >
                              <ImageWithBasePath
                                src={student.profile_picture_url}
                                className="img-fluid rounded-circle"
                                alt="img"
                              />
                            </Link>
                            <div className="ms-2">
                              <h5 className="mb-0">
                                <Link to={`${routes.studentDetail}?id=${student.studentId}`}>
                                  {student.name || 'Unknown Student'}
                                </Link>
                              </h5>
                              <p>
                                {student.class}
                                {student.section ? `, ${student.section}` : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gx-2">
                          <div>
                            <p className="mb-0">Roll No</p>
                            <p className="text-dark">{student.roll_number || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="mb-0">Gender</p>
                            <p className="text-dark">
                              {student.gender
                                ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="mb-0">Admitted on</p>
                            <p className="text-dark">{formatDate(student.admission_date)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
                          >
                            <i className="ti ti-brand-hipchat" />
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
                          >
                            <i className="ti ti-phone" />
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
                          >
                            <i className="ti ti-mail" />
                          </Link>
                        </div>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#add_fees_collect"
                          className="btn btn-light btn-sm fw-semibold"
                        >
                          Add Fees
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
      <StudentTypeModal />
    </>
  );
};

export default StudentGrid;
