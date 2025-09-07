import { useState } from 'react';
import { MODAL_TYPE } from '../../../core/constants/modal';
import type { TableData } from '../../../core/data/interface';
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
import PageLoader from '../../../shared/components/utils/PageLoader';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { useAuth } from '../../../shared/hooks/useAuth';
import { all_routes } from '../../router/all_routes';
import ClassDetailsView from './components/ClassDetailsView';
import ClassForm from './components/ClassForm';
import { useClassById } from './hooks/useClassById';
import { useClasses } from './hooks/useClasses';
import { useClassMutations } from './hooks/useClassMutations';
import type { ClassModel } from './models/class.model';

const Classes = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const authData = useAuth();
  const { classes, isLoading } = useClasses(page);
  const { classDetails } = useClassById(selectedId ?? -1);
  const { createClass, updateClass, deleteClass } = useClassMutations();
  const data = classes?.results;
  const route = all_routes;
  console.log('authData', authData);

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Class',
      align: 'center',
      render: (record: TableData) => record?.name,
    },
    {
      title: 'Academic year',
      align: 'center',
      render: (record: TableData) => record?.academic_year_name,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: 'center',
      render: (text: string) => (
        <>
          {text ? (
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
      align: 'center',
      render: (record: TableData) => (
        <>
          <DataTableColumnActions
            onEditButtonClick={() => {
              setSelectedId(record?.id);
              setActiveModal('edit');
            }}
            onViewButtonClick={() => {
              setSelectedId(record?.id);
              setActiveModal('view');
            }}
            onDeleteButtonClick={() => {
              setSelectedId(record?.id);
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

  const handleClassForm = async (data: ClassModel, mode: string) => {
    console.log('class', data);
    try {
      if (mode === 'add') {
        const response = await createClass(data);
        console.log('response', response);
      } else if (mode === 'edit' && classDetails?.id) {
        const response = await updateClass({ id: classDetails?.id, data: data });
        console.log('response', response);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleClassDelete = async () => {
    const response = await deleteClass(selectedId ?? -1);
    console.log('response', response);
  };

  if (isLoading) {
    return <PageLoader />;
  }
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
            <DataTableBody columns={columns} dataSource={data ?? []} Selection={true} />
          </DataTable>
        </div>
      </div>

      <>
        {/* Add Classes */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="md"
          modalTitle="Add Class"
          body={
            <ClassForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleClassForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Classes */}
        {classDetails && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Edit Class"
            body={
              <ClassForm
                mode="edit"
                defaultValues={classDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleClassForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Classes */}
        {classDetails && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Class Details"
            header={
              classDetails?.is_active ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Active
                </span>
              ) : (
                <span className="badge badge-soft-danger ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Inactive
                </span>
              )
            }
            body={<ClassDetailsView classData={classDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleClassDelete}
          title="Delete Item"
          message="Do you really want to delete? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Classes;
