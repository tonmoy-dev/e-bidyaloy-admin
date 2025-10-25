import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '../../../../core/constants/modal';
import type { TableData } from '../../../../core/data/interface';
import PageHeader from '../../../../shared/components/layout/PageHeader';
import DeleteConfirmationModal from '../../../../shared/components/modals/DeleteConfirmationModal';
import DataTable from '../../../../shared/components/table/DataTable';
import DataTableBody from '../../../../shared/components/table/DataTableBody';
import DataTableColumnActions from '../../../../shared/components/table/DataTableColumnActions';
import TableFilter, {
  type FilterConfig,
  type FilterOption,
} from '../../../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../../shared/components/table/DataTableHeader';
import DataModal, { type ModalType } from '../../../../shared/components/table/DataTableModal';
import TooltipOptions from '../../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../../router/all_routes';
import ExamTypeDetailsView from './components/ExamTypeDetailsView';
import ExamTypeForm from './components/ExamTypeForm';
import { useExamTypeById } from './hooks/useExamTypeById';
import { useExamTypes } from './hooks/useExamTypes';
import { useExamTypeMutations } from './hooks/useExamTypeMutations';
import { type ExamTypeModel, type CreateExamTypeRequest } from './models/exam-type.model';
import { useAppSelector } from '../../../../core/store';

const ExamTypes = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { examTypes } = useExamTypes(page);
  const data = examTypes?.results;
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createExamType, updateExamType, deleteExamType } = useExamTypeMutations();
  const { examTypeDetails, isError: isExamTypeError } = useExamTypeById(selectedId ?? null, skipQuery);
  const route = all_routes;

  useEffect(() => {
    if (isExamTypeError) {
      toast.error('Exam Type data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isExamTypeError]);

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Exam Type Name',
      align: 'center',
      render: (record: TableData) => record?.name,
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: 'Description',
      align: 'center',
      render: (record: TableData) => {
        const description = record?.description || '';
        return description.length > 50 ? `${description.substring(0, 50)}...` : description;
      },
    },
    {
      title: 'Weightage (%)',
      align: 'center',
      render: (record: TableData) => `${record?.weightage}%`,
      sorter: (a: TableData, b: TableData) => parseFloat(a.weightage) - parseFloat(b.weightage),
    },
    {
      title: 'Exam Count',
      align: 'center',
      render: (record: TableData) => record?.exam_count || '0',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: 'center',
      render: (isActive: boolean) => (
        <>
          {isActive ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Inactive
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
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  const examTypeFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending'];

  const authUser = useAppSelector((s) => s.auth.user);

  const handleExamTypeForm = async (data: CreateExamTypeRequest, mode: string) => {
    try {
      // For create, do not send organization (backend will associate via token/session).
      // For edit, include organization if available.
      if (mode === 'add') {
        const response = await createExamType(data as CreateExamTypeRequest);
        if (response?.data) {
          toast.success('Exam Type created successfully');
        }
      } else if (mode === 'edit' && examTypeDetails?.id) {
        const orgId = data.organization || (authUser ? (authUser.organization ?? authUser.organization_id ?? '') : '');
        const payload = { ...data, ...(orgId ? { organization: String(orgId) } : {}) } as CreateExamTypeRequest;
        const response = await updateExamType({ id: examTypeDetails?.id, data: payload });
        if (response?.data) {
          toast.success('Exam Type updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleExamTypeDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteExamType(selectedId);
      if (!response?.error) {
        toast.success('Exam Type deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete exam type');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Exam Types"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Examinations', path: '#' },
              { label: 'Exam Types' },
            ]}
            addButtonLabel="Add Exam Type"
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
                    filters={examTypeFilters}
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
        {/* Add Exam Type */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Exam Type Information"
          body={
            <ExamTypeForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleExamTypeForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Exam Type */}
        {examTypeDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Exam Type Information"
            body={
              <ExamTypeForm
                mode="edit"
                defaultValues={examTypeDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleExamTypeForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Exam Type */}
        {examTypeDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Exam Type Details"
            header={
              examTypeDetails?.is_active ? (
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
            body={<ExamTypeDetailsView examTypeData={examTypeDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleExamTypeDelete}
          title="Delete Exam Type"
          message="Do you really want to delete this exam type? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default ExamTypes;