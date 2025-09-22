import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import { all_routes } from '../../../router/all_routes';
// import { allClass, names } from '../../../../core/common/selectoption/selectoption';
import TeacherModal from '../teacherModal';
// import CommonSelect from '../../../../core/common/commonSelect';
import TooltipOption from '../../../../core/common/tooltipOption';
import { useTeacherMutations } from '../hooks/useTeacherMutations';
import { useTeachers } from '../hooks/useTeachers';
import type { TeacherModel } from '../models/teacher.model';

const TeacherGrid = () => {
  const routes = all_routes;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    class: '',
  });
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // API hooks
  const { isLoading, teachers, isError, error, refetch } = useTeachers(currentPage);

  const { deleteTeacher, isDeleting } = useTeacherMutations();

  // Transform and filter data
  const filteredTeachers = useMemo(() => {
    if (!teachers?.results) return [];

    return teachers.results.filter((teacher: TeacherModel) => {
      // Access nested user data
      const user = teacher.user;
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const matchesName = !filters.name || fullName.includes(filters.name.toLowerCase());
      const matchesDept =
        !filters.class || teacher.department.toLowerCase().includes(filters.class.toLowerCase());

      return matchesName && matchesDept;
    });
  }, [teachers, filters]);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(teacherId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  const handleLoadMore = () => {
    if (teachers?.next) {
      setCurrentPage((prev) => prev + 1);
      setLoadMoreClicked(true);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Loading state
  if (isLoading && !loadMoreClicked) {
    return (
      <div className="page-wrapper">
        <div className="content content-two">
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
        <div className="content content-two">
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
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teachers</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teachers
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

          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">
              Teachers Grid
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
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
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
                        <div className="col-md-6">
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
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <button
                        type="button"
                        className="btn btn-light me-3"
                        onClick={() => setFilters({ name: '', class: '' })}
                      >
                        Reset
                      </button>
                      <button type="button" onClick={handleApplyClick} className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={routes.teacherList}
                  className="btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link to={routes.teacherGrid} className="active btn btn-icon btn-sm primary-hover">
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

          <div className="row">
            {/* Teacher Grid Cards */}
            {filteredTeachers.map((teacher: TeacherModel) => {
              const user = teacher.user; // Access nested user data
              return (
                <div key={teacher.id} className="col-xxl-3 col-xl-4 col-md-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Link
                        to={`${routes.teacherDetails}?id=${teacher.id}`}
                        className="link-primary"
                      >
                        T{teacher.employee_id || teacher.id?.toString().slice(0, 6)}
                      </Link>
                      <div className="d-flex align-items-center">
                        <span
                          className={`badge d-inline-flex align-items-center me-1 ${
                            teacher.is_active ? 'badge-soft-success' : 'badge-soft-danger'
                          }`}
                        >
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          {teacher.is_active ? 'Active' : 'Inactive'}
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
                                to={`${routes.editTeacher}?id=${teacher.id}`}
                              >
                                <i className="ti ti-edit-circle me-2" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item rounded-1 border-0 bg-transparent w-100 text-start"
                                onClick={() => teacher.id && handleDeleteTeacher(teacher.id)}
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
                    </div>
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <Link
                            to={`${routes.teacherDetails}?id=${teacher.id}`}
                            className="avatar avatar-lg flex-shrink-0"
                          >
                            <ImageWithBasePath
                              src={user.profile_picture_url || 'assets/img/teachers/teacher-01.jpg'}
                              className="img-fluid rounded-circle"
                              alt="img"
                            />
                          </Link>
                          <div className="ms-2">
                            <h6 className="text-dark text-truncate mb-0">
                              <Link to={`${routes.teacherDetails}?id=${teacher.id}`}>
                                {user.first_name} {user.last_name}
                              </Link>
                            </h6>
                            <p>{teacher.department}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <p className="mb-0">Email</p>
                          <p className="text-dark">{user.email}</p>
                        </div>
                        <div>
                          <p className="mb-0">Phone</p>
                          <p className="text-dark">{user.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <span className="badge badge-soft-danger">{teacher.designation}</span>
                      <Link
                        to={`${routes.teacherDetails}?id=${teacher.id}`}
                        className="btn btn-light btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No Results */}
            {filteredTeachers.length === 0 && !isLoading && (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="ti ti-users fs-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No teachers found</h4>
                  <p className="text-muted">
                    {filters.name || filters.class
                      ? 'Try adjusting your filters or search terms'
                      : 'No teachers available at the moment'}
                  </p>
                  {(filters.name || filters.class) && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setFilters({ name: '', class: '' })}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Load More Button */}
            {teachers?.next && !isLoading && (
              <div className="text-center col-12">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-primary d-inline-flex align-items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="ti ti-loader me-2 spin"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-loader-3 me-2" />
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Loading More Indicator */}
            {isLoading && loadMoreClicked && (
              <div className="col-12">
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading more...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <TeacherModal />
    </>
  );
};

export default TeacherGrid;
