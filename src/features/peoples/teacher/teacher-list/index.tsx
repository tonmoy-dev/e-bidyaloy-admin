import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CommonSelect from '../../../../core/common/commonSelect';
import Table from '../../../../core/common/dataTable/index';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import TooltipOption from '../../../../core/common/tooltipOption';
import type { TableData } from '../../../../core/data/interface';
import { all_routes } from '../../../router/all_routes';
import { useTeacherMutations } from '../hooks/useTeacherMutations';
import { useTeachers } from '../hooks/useTeachers';
import type { TeacherModel } from '../models/teacher.model';
import TeacherModal from '../teacherModal';

const TeacherList = () => {
  const routes = all_routes;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    class: '',
    status: '',
  });

  // Enhanced CSS for proper dropdown positioning
  const customStyles = `
    /* Ensure all parent containers allow overflow to be visible */
    .page-wrapper,
    .content,
    .card,
    .card-body,
    .table-responsive,
    .ant-table,
    .ant-table-container,
    .ant-table-body,
    .ant-table-tbody {
      overflow: visible !important;
      position: static !important;
    }
    
    /* Force dropdown to use fixed positioning relative to viewport */
    .action-dropdown {
      position: relative !important;
    }
    
    .action-dropdown .dropdown-menu {
      position: fixed !important;
      z-index: 99999 !important;
      transform: none !important;
      will-change: auto !important;
      top: auto !important;
      // left: auto !important;
      // right: auto !important;
      margin: 0 !important;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25) !important;
      border: 1px solid rgba(0,0,0,.125) !important;
    }
    
    /* Ensure table cells don't clip the dropdown */
    .ant-table-cell {
      overflow: visible !important;
    }
    
    /* Custom positioning class for dropdown */
    .dropdown-positioned {
      position: fixed !important;
      z-index: 99999 !important;
      min-width: 180px;
      max-height: 300px;
      overflow-y: auto;
    }
  `;

  // API hooks
  const { isLoading, teachers, isError, error, refetch } = useTeachers(currentPage);
  const { deleteTeacher, isDeleting, isDeleteSuccess } = useTeacherMutations();

  // Transform API data for table
  const tableData = useMemo(() => {
    if (!teachers?.results) return [];

    return teachers.results.map((teacher: TeacherModel) => ({
      id: `T${teacher.id?.toString().slice(0, 8) || '00000000'}`,
      name: `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() || 'N/A',
      username: teacher.user?.username || 'N/A',
      class: teacher.department || 'N/A',
      subject: teacher.designation || 'N/A',
      email: teacher.user?.email || 'N/A',
      phone: teacher.user?.phone || 'N/A',
      dateofJoin: teacher.hire_date ? new Date(teacher.hire_date).toLocaleDateString() : 'N/A',
      status: teacher.is_active ? 'Active' : 'Inactive',
      img: teacher.user?.profile_picture_url || 'assets/img/teachers/teacher-01.jpg',
      teacherId: teacher.id,
      experience: teacher.experience_years || 0,
      qualifications: teacher.qualifications || 'N/A',
      specialization: teacher.specialization || 'N/A',
    }));
  }, [teachers]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return tableData.filter((teacher) => {
      const matchesName =
        !filters.name || teacher.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesClass =
        !filters.class || teacher.class.toLowerCase().includes(filters.class.toLowerCase());
      const matchesStatus = !filters.status || teacher.status === filters.status;

      return matchesName && matchesClass && matchesStatus;
    });
  }, [tableData, filters]);

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(teacherId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        alert('Failed to delete teacher. Please try again.');
      }
    }
  };

  // Function to position dropdown relative to trigger button
  const positionDropdown = (dropdownMenu: HTMLElement, triggerButton: HTMLElement) => {
    const rect = triggerButton.getBoundingClientRect();
    const dropdownRect = dropdownMenu.getBoundingClientRect();

    // Calculate position
    let top = rect.bottom + window.scrollY + 5; // 5px gap
    let left = rect.left + window.scrollX;

    // Adjust if dropdown would go off-screen
    if (left + dropdownRect.width > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownRect.width;
    }

    if (top + dropdownRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - dropdownRect.height - 5;
    }

    dropdownMenu.style.top = `${top}px`;
    dropdownMenu.style.left = `${left}px`;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text: string, record: any) => (
        <Link to={`${routes.teacherDetails}?id=${record.teacherId}`} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.teacherDetails}?id=${record.teacherId}`} className="avatar avatar-md">
            <ImageWithBasePath src={record.img} className="img-fluid rounded-circle" alt="img" />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.teacherDetails}?id=${record.teacherId}`}>{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: (a: TableData, b: TableData) => a.username.localeCompare(b.username),
    },
    {
      title: 'Department',
      dataIndex: 'class',
      sorter: (a: TableData, b: TableData) => a.class.localeCompare(b.class),
    },
    {
      title: 'Designation',
      dataIndex: 'subject',
      sorter: (a: TableData, b: TableData) => a.subject.localeCompare(b.subject),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text: string) => (
        <span title={text}>{text.length > 25 ? `${text.substring(0, 25)}...` : text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a: TableData, b: TableData) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Date Of Join',
      dataIndex: 'dateofJoin',
      sorter: (a: TableData, b: TableData) =>
        new Date(a.dateofJoin).getTime() - new Date(b.dateofJoin).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: string) => (
        <>
          {text === 'Active' ? (
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
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center action-dropdown">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={(e) => {
                // Position dropdown after Bootstrap handles the toggle
                setTimeout(() => {
                  const dropdownMenu = e.currentTarget.nextElementSibling as HTMLElement;
                  if (dropdownMenu && dropdownMenu.classList.contains('show')) {
                    dropdownMenu.classList.add('dropdown-positioned');
                    positionDropdown(dropdownMenu, e.currentTarget as HTMLElement);
                  }
                }, 10);
              }}
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to={`${routes.teacherDetails}?id=${record.teacherId}`}
                >
                  <i className="ti ti-menu me-2" />
                  View Teacher
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to={`${routes.editTeacher}?id=${record.teacherId}`}
                >
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
                >
                  <i className="ti ti-lock me-2" />
                  Login Details
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to="#">
                  <i className="ti ti-toggle-right me-2" />
                  {record.status === 'Active' ? 'Disable' : 'Enable'}
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1 border-0 bg-transparent w-100 text-start"
                  onClick={() => record.teacherId && handleDeleteTeacher(record.teacherId)}
                  disabled={isDeleting}
                  style={{ opacity: isDeleting ? 0.6 : 1 }}
                >
                  <i className="ti ti-trash-x me-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      class: '',
      status: '',
    });
  };

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
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Teachers</h4>
            <p>
              {error && typeof error === 'object' && 'message' in error
                ? (error as any).message
                : 'Failed to load teachers. Please try again.'}
            </p>
            <button className="btn btn-outline-danger" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Peoples</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link to={routes.addTeacher} className="btn btn-primary d-flex align-items-center">
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Teacher
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Teachers List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">
                Teachers List
                {teachers && <span className="text-muted ms-2">({teachers.count} total)</span>}
              </h4>
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
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name..."
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Department</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search by department..."
                                value={filters.class}
                                onChange={(e) => handleFilterChange('class', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={[
                                  { value: '', label: 'All Status' },
                                  { value: 'Active', label: 'Active' },
                                  { value: 'Inactive', label: 'Inactive' },
                                ]}
                                value={filters.status}
                                onChange={(value) => handleFilterChange('status', value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light me-3"
                          onClick={handleResetFilters}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                  <Link to="#" className="active btn btn-icon btn-sm me-1 primary-hover">
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.teacherGrid}
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
              {/* Teacher List */}
              <Table
                dataSource={filteredData}
                columns={columns}
                Selection={true}
                loading={isLoading}
              />
              {/* /Teacher List */}

              {/* Pagination Info */}
              {teachers && (
                <div className="d-flex justify-content-between align-items-center mt-3 px-3">
                  <div className="text-muted">
                    Showing {filteredData.length} of {teachers.count} teachers
                  </div>
                  <div className="d-flex gap-2">
                    {teachers.previous && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {teachers.next && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* /Teachers List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <TeacherModal />
    </>
  );
};

export default TeacherList;
