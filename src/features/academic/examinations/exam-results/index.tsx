
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
import ExamResultForm from './components/ExamResultForm';
import { useExamResultById } from './hooks/useGetExamResultById';
import { useExamResultsList } from './hooks/useGetExamResultsList';
import { useExamResultMutations } from './hooks/useExamResultMutations';
import { type ExamResultModel } from './models/examResult.model';

const ExamResults = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { examResults } = useExamResultsList(page);
  const data = examResults?.results;
  const skipQuery = !selectedId || activeModal === MODAL_TYPE.DELETE;
  const { createExamResult, updateExamResult, deleteExamResult } = useExamResultMutations();
  const {
    examResultDetails,
    isError: isExamResultError,
    isLoading: isExamResultLoading,
  } = useExamResultById(selectedId ?? null, skipQuery);
  const route = all_routes;

  useEffect(() => {
    if (isExamResultError) {
      toast.error('ExamResult data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isExamResultError]);

  const columns = [
    {
      title: 'ID',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Examination ID',
      align: 'center',
      render: (record: TableData) => record?.examinationId,
    },
    {
      title: 'Student ID',
      align: 'center',
      render: (record: TableData) => record?.studentId,
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
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const examResultFilters: FilterConfig[] = [
    {
      key: 'is_active',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending', 'Recently Added', 'Recently Viewed'];

  const handleExamResultForm = async (data: ExamResultModel, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createExamResult(data);
        if (response?.data) {
          toast.success('ExamResult created successfully');
        }
      } else if (mode === 'edit' && examResultDetails?.id) {
        const response = await updateExamResult({ id: examResultDetails?.id, data: data });
        if (response?.data) {
          toast.success('ExamResult updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleExamResultDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteExamResult(selectedId);
      if (response) {
        toast.success('ExamResult deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete examResult. Please try again.');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="ExamResults"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'ExamResults' },
            ]}
            addButtonLabel="Add Exam Result"
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
                    filters={examResultFilters}
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
        {/* Add ExamResult */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add ExamResult Information"
          body={
            <ExamResultForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleExamResultForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit ExamResult */}
        {activeModal === MODAL_TYPE.EDIT && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update ExamResult Information"
            body={
              isExamResultLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading examResult details...</p>
                </div>
              ) : examResultDetails?.id ? (
                <ExamResultForm
                  key={examResultDetails.id}
                  mode="edit"
                  defaultValues={examResultDetails}
                  onActiveModal={setActiveModal}
                  onSubmit={async (data) => {
                    await handleExamResultForm(data, 'edit');
                    setActiveModal(null);
                    setSelectedId(null);
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load examResult details.</p>
                </div>
              )
            }
          />
        )}

        {/* View ExamResult */}
        {activeModal === MODAL_TYPE.VIEW && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="ExamResult Details"
            body={
              isExamResultLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading examResult details...</p>
                </div>
              ) : examResultDetails?.id ? (
                <div>...</div>
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load examResult details.</p>
                </div>
              )
            }
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleExamResultDelete}
          title="Delete ExamResult"
          message="Do you really want to delete this examResult? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default ExamResults;
