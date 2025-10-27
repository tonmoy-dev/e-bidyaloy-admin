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
import { useStudentById } from '../../../peoples/students/hooks/useStudentById';
import { all_routes } from '../../../router/all_routes';
import { useGradeById } from '../grade/hooks/useGetGradeById';
import ExamResultForm from './components/ExamResultForm';
import { useExamResultMutations } from './hooks/useExamResultMutations';
import { useExamSubjectById } from './hooks/useExamSubjectById';
import { useExamResultById } from './hooks/useGetExamResultById';
import { useExamResultsList } from './hooks/useGetExamResultsList';
import { type ExamResultModel } from './models/examResult.model';

// Helper component to fetch and display exam subject name
const ExamSubjectName = ({ id }: { id: string | null }) => {
  console.log('ExamSubjectName rendering with id:', id);
  const { examSubject, isLoading, isError } = useExamSubjectById(id, !id);

  console.log('ExamSubjectName hook result:', { examSubject, isLoading, isError });

  if (!id) return <span>-</span>;
  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span className="text-danger">Error</span>;

  return <span>{examSubject?.subject_name || id}</span>;
};

// Helper component to fetch and display student name
const StudentName = ({ id }: { id: string | null }) => {
  // You'll need to create this hook
  const { studentDetails } = useStudentById(id);
  if (!id) return <span>-</span>;
  return <span>{studentDetails?.student_id || id}</span>;
};

// Helper component to fetch and display grade name
const GradeName = ({ id }: { id: string | null }) => {
  // You'll need to create this hook
  const { gradeDetails } = useGradeById(id, !id);
  if (!id) return <span>-</span>;
  return <span>{gradeDetails?.name || id}</span>;
};

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
      title: 'S.No',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Exam Subject',
      align: 'center',
      render: (record: TableData) => <ExamSubjectName id={record?.exam_subject} />,
    },
    {
      title: 'Student',
      align: 'center',
      render: (record: TableData) => <StudentName id={record?.student} />,
    },
    {
      title: 'Marks Obtained',
      align: 'center',
      render: (record: TableData) => record?.marks_obtained || '0.00',
    },
    {
      title: 'Grade',
      align: 'center',
      render: (record: TableData) => <GradeName id={record?.grade} />,
    },
    {
      title: 'Remarks',
      align: 'center',
      render: (record: TableData) => record?.remarks || '-',
    },
    {
      title: 'Absent',
      align: 'center',
      render: (record: TableData) => (
        <span className={`badge ${record?.is_absent ? 'bg-danger' : 'bg-success'}`}>
          {record?.is_absent ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      title: 'Created At',
      align: 'center',
      render: (record: TableData) =>
        record?.created_at ? new Date(record.created_at).toLocaleDateString() : '-',
    },
    {
      title: 'Updated At',
      align: 'center',
      render: (record: TableData) =>
        record?.updated_at ? new Date(record.updated_at).toLocaleDateString() : '-',
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
    { label: 'Present', value: 'false' },
    { label: 'Absent', value: 'true' },
  ];

  const examResultFilters: FilterConfig[] = [
    {
      key: 'is_absent',
      label: 'Attendance',
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
            title="Exam Results"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Exam Results' },
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
          modalTitle="Add Exam Result Information"
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
            modalTitle="Update Exam Result Information"
            body={
              isExamResultLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading exam result details...</p>
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
                  <p>Failed to load exam result details.</p>
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
            modalTitle="Exam Result Details"
            body={
              isExamResultLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading exam result details...</p>
                </div>
              ) : examResultDetails?.id ? (
                <div className="p-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>Exam Subject:</strong>
                      <div>
                        <ExamSubjectName id={examResultDetails.exam_subject} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <strong>Student:</strong>
                      <div>
                        <StudentName id={examResultDetails.student} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <strong>Marks Obtained:</strong>
                      <div>{examResultDetails.marks_obtained}</div>
                    </div>
                    <div className="col-md-6">
                      <strong>Grade:</strong>
                      <div>
                        <GradeName id={examResultDetails.grade} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <strong>Remarks:</strong>
                      <div>{examResultDetails.remarks || '-'}</div>
                    </div>
                    <div className="col-md-6">
                      <strong>Absent:</strong>
                      <div>
                        <span
                          className={`badge ${
                            examResultDetails.is_absent ? 'bg-danger' : 'bg-success'
                          }`}
                        >
                          {examResultDetails.is_absent ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <strong>Created At:</strong>
                      <div>{new Date(examResultDetails.created_at).toLocaleString()}</div>
                    </div>
                    <div className="col-md-6">
                      <strong>Updated At:</strong>
                      <div>{new Date(examResultDetails.updated_at).toLocaleString()}</div>
                    </div>
                    {examResultDetails.deleted_at && (
                      <div className="col-md-12">
                        <strong>Deleted At:</strong>
                        <div>{new Date(examResultDetails.deleted_at).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load exam result details.</p>
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
          title="Delete Exam Result"
          message="Do you really want to delete this exam result? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default ExamResults;
