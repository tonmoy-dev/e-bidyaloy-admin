import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '../../../../core/constants/modal';
import type { TableData } from '../../../../core/data/interface';
import PageHeader from '../../../../shared/components/layout/PageHeader';
import DeleteConfirmationModal from '../../../../shared/components/modals/DeleteConfirmationModal';
import DataTable from '../../../../shared/components/table/DataTable';
import DataTableBody from '../../../../shared/components/table/DataTableBody';
import DataTableColumnActions from '../../../../shared/components/table/DataTableColumnActions';
import TableFilter, { type FilterConfig, type FilterOption } from '../../../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../../shared/components/table/DataTableHeader';
import DataModal, { type ModalType } from '../../../../shared/components/table/DataTableModal';
import TooltipOptions from '../../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../../router/all_routes';
import ExamDetailsView from './components/ExamDetailsView';
import ExamForm from './components/ExamForm';
import { useExamById } from './hooks/useExamById';
import { useExams } from './hooks/useExams';
import { useExamMutations } from './hooks/useExamMutations';
import { type CreateExamRequest } from './models/exam.model';

const Exams = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { exams } = useExams(page);
  const data = exams?.results;
  const [selectedClass, setSelectedClass] = useState<string>('');
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createExam, updateExam, deleteExam } = useExamMutations();
  const { examDetails, isError: isExamError } = useExamById(selectedId ?? null, skipQuery);
  const route = all_routes;

  useEffect(() => {
    if (isExamError) {
      toast.error('Exam data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isExamError]);

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Exam Name',
      align: 'center',
      render: (record: TableData) => record?.name,
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: 'Class',
      align: 'center',
      render: (record: TableData) => record?.class_name || 'N/A',
    },
    {
      title: 'Exam Type',
      align: 'center',
      render: (record: TableData) => record?.exam_type_name || 'N/A',
    },
    {
      title: 'Academic Year',
      align: 'center',
      render: (record: TableData) => record?.academic_year_name || 'N/A',
    },
    {
      title: 'Start Date',
      align: 'center',
      render: (record: TableData) => record?.start_date ? new Date(record.start_date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'End Date',
      align: 'center',
      render: (record: TableData) => record?.end_date ? new Date(record.end_date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Subject Count',
      align: 'center',
      render: (record: TableData) => record?.subject_count || record?.exam_subjects?.length || '0',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => (
        <>
          {status === 'active' ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          ) : status === 'scheduled' ? (
            <span className="badge badge-soft-warning d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Scheduled
            </span>
          ) : status === 'completed' ? (
            <span className="badge badge-soft-info d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Completed
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Cancelled
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

  // Build class filter options from current data set
  const classOptions: FilterOption[] = useMemo(() => {
    const names = Array.from(
      new Set((data ?? []).map((r: TableData) => r?.class_name).filter((v): v is string => !!v)),
    );
    return [{ label: 'All', value: '' }, ...names.map((n) => ({ label: n, value: n }))];
  }, [data]);

  const examFilters: FilterConfig[] = [
    {
      key: 'class',
      label: 'Class',
      options: classOptions,
      defaultValue: classOptions[0] ?? { label: 'All', value: '' },
    },
  ];

  const filteredData = useMemo(() => {
    if (!selectedClass) return data ?? [];
    return (data ?? []).filter((r: TableData) => r?.class_name === selectedClass);
  }, [data, selectedClass]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleExamForm = async (data: CreateExamRequest, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createExam(data);
        if (response?.data) {
          toast.success('Exam created successfully');
        }
      } else if (mode === 'edit' && examDetails?.id) {
        const response = await updateExam({ id: examDetails?.id, data });
        if (response?.data) {
          toast.success('Exam updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleExamDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteExam(selectedId);
      if (!response?.error) {
        toast.success('Exam deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete exam');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Exams"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Examinations', path: '#' },
              { label: 'Exams' },
            ]}
            addButtonLabel="Add Exam"
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
                    filters={examFilters}
                    onApply={(filters) => {
                      const selected = filters['class'];
                      setSelectedClass((selected?.value ?? '').toString());
                    }}
                    onReset={() => {
                      setSelectedClass('');
                    }}
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
            <DataTableBody columns={columns} dataSource={filteredData} Selection={true} />
          </DataTable>
        </div>
      </div>

      <>
        {/* Add Exam */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="xl"
          modalTitle="Add Exam Information"
          body={
            <ExamForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleExamForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Exam */}
        {examDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Update Exam Information"
            body={
              <ExamForm
                mode="edit"
                defaultValues={examDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleExamForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Exam */}
        {examDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Exam Details"
            header={
              examDetails?.status === 'active' ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Active
                </span>
              ) : examDetails?.status === 'scheduled' ? (
                <span className="badge badge-soft-warning ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Scheduled
                </span>
              ) : examDetails?.status === 'completed' ? (
                <span className="badge badge-soft-info ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Completed
                </span>
              ) : (
                <span className="badge badge-soft-danger ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Cancelled
                </span>
              )
            }
            body={<ExamDetailsView examData={examDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleExamDelete}
          title="Delete Exam"
          message="Do you really want to delete this exam? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Exams;