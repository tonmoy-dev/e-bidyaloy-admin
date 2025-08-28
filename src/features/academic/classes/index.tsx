import { useRef } from 'react';
import { Link } from 'react-router-dom';
import CommonSelect from '../../../core/common/commonSelect';
import { classSection } from '../../../core/common/selectoption/selectoption';
import type { TableData } from '../../../core/data/interface';
import { classes } from '../../../core/data/json/classes';
import PageHeader from '../../../shared/components/layout/PageHeader';
import EntityModal from '../../../shared/components/modals/EntityModal';
import DataTable from '../../../shared/components/table/DataTable';
import DataTableBody from '../../../shared/components/table/DataTableBody';
import DataTableFooter from '../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../shared/components/table/DataTableHeader';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../router/all_routes';

const Classes = () => {
  const data = classes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };
  const route = all_routes;
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (record: any) => (
        <>
          <Link to="#" className="link-primary">
            {record.id}
          </Link>
        </>
      ),
    },

    {
      title: 'Class',
      dataIndex: 'class',
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: 'Section',
      dataIndex: 'section',
      sorter: (a: TableData, b: TableData) => a.section.length - b.section.length,
    },
    {
      title: 'No of Student',
      dataIndex: 'noOfStudents',
      sorter: (a: TableData, b: TableData) => a.noOfStudents.length - b.noOfStudents.length,
    },
    {
      title: 'No of Subjects',
      dataIndex: 'noOfSubjects',
      sorter: (a: TableData, b: TableData) => a.noOfSubjects.length - b.noOfSubjects.length,
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
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <>
          <div className="d-flex align-items-center">
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
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_class"
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
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];

  const filtersConfig: FilterConfig[] = [
    {
      label: 'Class',
      options: [
        { label: 'Class 1', value: 'class1' },
        { label: 'Class 2', value: 'class2' },
      ],
      onChange: (selected) => console.log('Class:', selected),
      defaultValue: { label: 'Class 1', value: 'class1' },
    },
    {
      label: 'Section',
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
      ],
      onChange: (selected) => console.log('Section:', selected),
    },
  ];

  const sortingOptions = ['Ascending', 'Descending', 'Recently Viewed'];

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Classes"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Classes', path: '#' },
              { label: 'All Classes' },
            ]}
            addButtonLabel="Add Class"
            onAddClick={() => {}}
          >
            <TooltipOptions showPrint={true} showExport={true} />
          </PageHeader>
          {/* /Page Header */}
          {/* Page Table */}
          <DataTable
            header={
              <DataTableHeader
                filters={filtersConfig}
                sortingOptions={sortingOptions}
                onApply={() => console.log('Apply clicked')}
                onReset={() => console.log('Reset clicked')}
                onSortChange={(sort) => console.log('Sort:', sort)}
                defaultSort="Ascending"
              />
            }
            footer={<DataTableFooter />}
          >
            <DataTableBody columns={columns} dataSource={data} Selection={true} />
          </DataTable>
          {/* /Page Table */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <EntityModal
        id="add_class"
        title="Add Class"
        fields={[
          { label: 'Class Name', name: 'className', type: 'text' },
          {
            label: 'Section',
            name: 'section',
            type: 'select',
            options: [{ label: 'A', value: 'A' }],
          },
        ]}
        onSubmit={(data) => console.log(data)}
      />
      <>
        {/* Add Classes */}
        <div className="modal fade" id="add_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Class</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Class Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className="select"
                          options={classSection}
                          defaultValue={classSection[0]}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No of Students</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No of Subjects</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                    Add Class
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Classes */}
        {/* Edit Classes */}
        <div className="modal fade" id="edit_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Class</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Class Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Class Name"
                          defaultValue="I"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className="select"
                          options={classSection}
                          defaultValue={classSection[0]}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No of Students</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter no of Students"
                          defaultValue={30}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No of Subjects</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter no of Subjects"
                          // defaultValue={03}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Classes */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                      Cancel
                    </Link>
                    <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
        {/* View Classes */}
        <div className="modal fade" id="view_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Class Details</h4>
                  <span className="badge badge-soft-success ms-2">
                    <i className="ti ti-circle-filled me-1 fs-5" />
                    Active
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>Class Name</p>
                        <span>III</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>Section</p>
                        <span>A</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>No of Subjects</p>
                        <span>05</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>No of Students</p>
                        <span>25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /View Classes */}
      </>
    </div>
  );
};

export default Classes;
