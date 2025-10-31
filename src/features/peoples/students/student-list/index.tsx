/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommonSelect from '../../../../core/common/commonSelect';
import Table from '../../../../core/common/dataTable/index';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import {
  allClass,
  allSection,
  gender,
  names,
  status,
} from '../../../../core/common/selectoption/selectoption';
import TooltipOption from '../../../../core/common/tooltipOption';
import type { TableData } from '../../../../core/data/interface';
import { all_routes } from '../../../router/all_routes';
import { useStudentMutations } from '../hooks/useStudentMutations';
import { useStudents } from '../hooks/useStudents';
import StudentModals from '../studentModals';
import StudentTypeModal from '../StudentTypeModal';

const StudentList = () => {
  const routes = all_routes;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    class: '',
    section: '',
    gender: '',
    status: '',
  });

  // API hooks
  const { isLoading, students, isError, refetch } = useStudents(currentPage);
  const { deleteStudent, isDeleteSuccess } = useStudentMutations();

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // Transform API data for table
  const tableData = useMemo(() => {
    if (!students?.results) return [];
    return students.results.map((s: any) => ({
      key: s.id ?? s.id ?? s.admission_number ?? Math.random().toString(36).slice(2),
      student_id: s.student_id ?? s.admission_number ?? '',
      RollNo: s.roll_number ?? '',
      name: s.user?.full_name || `${s.user?.first_name ?? ''} ${s.user?.last_name ?? ''}`.trim(),
      class: s.class_name || s.class_assigned?.name || '',
      section: s.section_name || s.section?.name || '',
      gender: s.user?.gender || '',
      status: s.status || '',
      raw: s,
      studentId: s.id,
    }));
  }, [students]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return tableData.filter((student) => {
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
  }, [tableData, filters]);

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

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value?.value || value || '',
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResetFilters = () => {
    setFilters({
      name: '',
      class: '',
      section: '',
      gender: '',
      status: '',
    });
  };

  // Ensure refetch on successful deletion
  useEffect(() => {
    if (isDeleteSuccess) {
      refetch();
    }
  }, [isDeleteSuccess, refetch]);

  // Utility to extract a stable student id from either the static fixture or transformed row
  const getStudentId = (record: any) =>
    record?.student_id ?? record?.AdmissionNo ?? record?.admNo ?? '';

  // Populate student modals with the selected student's info so when Bootstrap opens them they show correct data
  const populateStudentModals = (record: any) => {
    try {
      const studentId = getStudentId(record);
      const name = record?.name ?? `${record?.first_name ?? ''} ${record?.last_name ?? ''}`.trim();
      const imgSrc = record?.imgSrc ?? record?.avatar ?? 'assets/img/students/student-01.jpg';

      // console.log('Populating modals for student ID:', studentId, 'Name:', name);

      // Add Fees modal badge (admission no)
      const addFeesBadge = document.querySelector('#add_fees_collect .badge-sm');
      if (addFeesBadge) addFeesBadge.textContent = studentId;

      // Add Fees modal avatar img
      const addFeesImg = document.querySelector('#add_fees_collect img');
      if (addFeesImg && imgSrc) (addFeesImg as HTMLImageElement).src = imgSrc;

      // Login Details modal: name and avatar
      const loginName = document.querySelector('#login_detail .name-info h6');
      if (loginName && name) loginName.textContent = name;
      const loginImg = document.querySelector('#login_detail img');
      if (loginImg && imgSrc) (loginImg as HTMLImageElement).src = imgSrc;

      // Delete modal: make message a bit specific
      const deleteMsg = document.querySelector('#delete-modal .modal-body p');
      if (deleteMsg && name)
        deleteMsg.textContent = `You want to delete ${name} (${studentId}), this can't be undone once you delete.`;
    } catch {
      // ignore DOM errors
    }
  };
  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      render: (text: string, record: any) => (
        <Link to={`${routes.studentDetail}?id=${record.studentId}`} className="avatar avatar-md">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => (a.student_id || '').localeCompare(b.student_id || ''),
    },
    {
      title: 'Roll No',
      dataIndex: 'RollNo',
      render: (text: string, record: any) => (
        <Link
          to="#"
          className="text-dark"
          data-bs-toggle="modal"
          data-bs-target="#login_detail"
          onClick={() => populateStudentModals(record)}
        >
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.RollNo.length - b.RollNo.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <Link to={`${routes.studentDetail}?id=${record.studentId}`} className="avatar avatar-md">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: 'Class',
      dataIndex: 'class',
      render: (text: string, record: any) => (
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#login_detail"
          onClick={() => populateStudentModals(record)}
        >
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: 'Section',
      dataIndex: 'section',
      render: (text: string, record: any) => (
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#login_detail"
          onClick={() => populateStudentModals(record)}
        >
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.section.length - b.section.length,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      render: (text: string, record: any) => (
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#login_detail"
          onClick={() => populateStudentModals(record)}
        >
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.gender.length - b.gender.length,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: string, record: any) => (
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#login_detail"
          onClick={() => populateStudentModals(record)}
        >
          {text === 'active' ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <>
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
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_fees_collect"
              onClick={() => populateStudentModals(record)}
              className="btn btn-light fs-12 fw-semibold me-3"
            >
              Collect Fees
            </Link>
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded={false}
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login_detail"
                    onClick={() => populateStudentModals(record)}
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
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login_detail"
                    onClick={() => populateStudentModals(record)}
                  >
                    <i className="ti ti-lock me-2" />
                    Login Details
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to="#">
                    <i className="ti ti-toggle-right me-2" />
                    Disable
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item rounded-1" to="student-promotion">
                    <i className="ti ti-arrow-ramp-right-2 me-2" />
                    Promote Student
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1 border-0 bg-transparent text-danger"
                    onClick={() => handleDeleteStudent(record.studentId)}
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Students
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
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Students List</h4>
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
                                onChange={(value) => handleFilterChange('class', value)}
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
                                onChange={(value) => handleFilterChange('section', value)}
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
                                onChange={(value) => handleFilterChange('name', value)}
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
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.studentGrid}
                    className="btn btn-icon btn-sm bg-light primary-hover"
                  >
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
                    Sort by A-Z
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
            <div className="card-body p-0 py-3">
              {/* Student List */}
              {isLoading ? (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : isError ? (
                <div className="text-center p-4">
                  <div className="alert alert-danger">
                    Error loading students. Please try again.
                  </div>
                </div>
              ) : (
                <Table dataSource={filteredData} columns={columns} Selection={true} />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
      <StudentTypeModal />
    </>
  );
};

export default StudentList;
