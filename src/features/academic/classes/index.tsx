import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TableData } from '../../../core/data/interface';
import { classes } from '../../../core/data/json/classes';
import PageHeader from '../../../shared/components/layout/PageHeader';
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
import DataModal, { type ModalType } from '../../../shared/components/table/DataTableModal';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { useAuth } from '../../../shared/hooks/useAuth';
import { all_routes } from '../../router/all_routes';
import ClassForm from './components/ClassForm';
import type { ClassModel } from './models/model';

const Classes = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
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
          <DataTableColumnActions
            onEditButtonClick={() => {
              setActiveModal('edit');
            }}
            onViewButtonClick={() => {
              setActiveModal('view');
            }}
            onDeleteButtonClick={() => {
              setActiveModal('delete');
            }}
          />
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
            onAddClick={() => {
              setActiveModal('add');
            }}
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
          show={activeModal === 'add'}
          onClose={() => setActiveModal(null)}
          size="md"
          modalTitle="Add Class"
          body={
            <ClassForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await createClassHandler(data);
                setActiveModal(null); // close only on success
              }}
            />
          }
          footer={<></>}
        />

        {/* Edit Classes */}
        <DataModal
          show={activeModal === 'edit'}
          onClose={() => setActiveModal(null)}
          modalTitle="Edit Class"
          body={
            <ClassForm
              mode="edit"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await createClassHandler(data);
                setActiveModal(null); // close only on success
              }}
            />
          }
          footer={<></>}
        />

        {/* View Classes */}
        <DataModal
          show={activeModal === 'view'}
          onClose={() => setActiveModal(null)}
          modalTitle="Class Details"
          header={
            <span className="badge badge-soft-success ms-2">
              <i className="ti ti-circle-filled me-1 fs-5" />
              Active
            </span>
          }
          body={
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
          }
          footer={<></>}
        />

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === 'delete'}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {}}
          title="Delete Item"
          message="Do you really want to delete? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Classes;
