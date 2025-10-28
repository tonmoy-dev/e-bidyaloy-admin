import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '../../../../core/constants/modal';
import type { TableData } from '../../../../core/data/interface';
import PageHeader from '../../../../shared/components/layout/PageHeader';
import DataTable from '../../../../shared/components/table/DataTable';
import DataTableBody from '../../../../shared/components/table/DataTableBody';
import TableFilter, { type FilterConfig, type FilterOption } from '../../../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../../shared/components/table/DataTableHeader';
import DataModal, { type ModalType } from '../../../../shared/components/table/DataTableModal';
import TooltipOptions from '../../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../../router/all_routes';
import StudentExamDetailsView from './components/StudentExamDetailsView';
import { useExamById } from './hooks/useExamById';
import { useExams } from './hooks/useExams';

const StudentExams = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { exams } = useExams(page);
  const data = exams?.results;
  const [selectedClass, setSelectedClass] = useState<string>('');
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
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
      title: 'View Routine',
      align: 'center',
      render: (record: TableData) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedId(record?.id);
            setActiveModal('view');
          }}
        >
          <i className="ti ti-eye me-1"></i>
          View Routine
        </button>
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

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Exam Routine"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.studentDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Examinations', path: '#' },
              { label: 'Exam Routine' },
            ]}
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
            <DataTableBody columns={columns} dataSource={filteredData} Selection={false} />
          </DataTable>
        </div>
      </div>

      <>
        {/* View Exam Routine */}
        {examDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Exam Routine"
            body={<StudentExamDetailsView examData={examDetails} />}
          />
        )}
      </>
    </div>
  );
};

export default StudentExams;