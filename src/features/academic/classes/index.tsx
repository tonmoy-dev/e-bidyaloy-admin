import { Link } from 'react-router-dom';
import CommonSelect from '../../../core/common/commonSelect';
import { classSection } from '../../../core/common/selectoption/selectoption';
import type { TableData } from '../../../core/data/interface';
import { classes } from '../../../core/data/json/classes';
import PageHeader from '../../../shared/components/layout/PageHeader';
import DataModal from '../../../shared/components/modals/DataModal';
import DeleteConfirmationModal from '../../../shared/components/modals/DeleteConfirmationModal';
import DataTable from '../../../shared/components/table/DataTable';
import DataTableBody from '../../../shared/components/table/DataTableBody';
import DataTableColumnActions from '../../../shared/components/table/DataTableColumnActions';
import TableFilter, {
  type FilterConfig,
  type FilterOption,
} from '../../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../shared/components/table/DataTableHeader';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { useAuth } from '../../../shared/hooks/useAuth';
import { all_routes } from '../../router/all_routes';
import ClassForm from './components/ClassForm';
import type { ClassModel } from './models/model';

const viewActionId = 'view-class';
const editActionId = 'edit-class';
const addActionId = 'add-class';

const Classes = () => {
  const data = classes;
  const route = all_routes;
  const authData = useAuth();
  console.log('authData', authData);

  const columns = [
    {
      title: 'SL',
      dataIndex: 'id',
      align: 'center',
      render: (record: TableData) => (
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
      align: 'center',
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
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
      align: 'center',
      render: () => (
        <>
          <DataTableColumnActions viewActionId={viewActionId} editActionId={editActionId} />
        </>
      ),
    },
  ];

  const statusOptions: FilterOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const classFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending'];

  const createClassHandler = async (data: ClassModel) => {
    console.log('class', data);
  };
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
            addButtonId={addActionId}
            onAddClick={() => {}}
          >
            <TooltipOptions showPrint={true} showExport={true} />
          </PageHeader>

          {/* Page Table */}
          <DataTable
            header={
              <DataTableHeader
                filters={
                  <TableFilter
                    filters={classFilters}
                    onApply={(filters) => console.log('Apply:', filters)}
                    onReset={(filters) => console.log('Reset:', filters)}
                  />
                }
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
        </div>
      </div>

      <>
        {/* Add Classes */}
        <DataModal
          modalId={addActionId}
          modalTitle="Add Class"
          handleModalFormSubmit={() => {}}
          header={<></>}
          body={<ClassForm mode="add" onSubmit={createClassHandler} />}
          footer={
            <>
              <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                Cancel
              </Link>
              <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                Add Class
              </Link>
            </>
          }
        />

        {/* Edit Classes */}
        <DataModal
          modalId={editActionId}
          modalTitle="Edit Class"
          handleModalFormSubmit={() => {}}
          header={<></>}
          body={
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
          }
          footer={
            <>
              <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                Cancel
              </Link>
              <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                Save Changes
              </Link>
            </>
          }
        />

        {/* View Classes */}
        <DataModal
          modalId={viewActionId}
          modalTitle="Class Details"
          handleModalFormSubmit={() => {}}
          header={
            <>
              <span className="badge badge-soft-success ms-2">
                <i className="ti ti-circle-filled me-1 fs-5" />
                Active
              </span>
            </>
          }
          body={
            <>
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
            </>
          }
          footer={<></>}
        />

        {/* Delete Modal */}
        <DeleteConfirmationModal
          onDeleteCancel={() => console.log('Delete cancelled')}
          onDeleteConfirm={() => console.log('Delete confirmed')}
        />
      </>
    </div>
  );
};

export default Classes;
