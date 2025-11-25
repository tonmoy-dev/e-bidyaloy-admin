import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MODAL_TYPE } from '../../../core/constants/modal';
import type { TableData } from '../../../core/data/interface';
import { useAppSelector } from '../../../core/store';
import PageHeader from '../../../shared/components/layout/PageHeader';
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
import { all_routes } from '../../router/all_routes';
import StudentAssignmentDetailsView from './components/StudentAssignmentDetailsView';
import { useAssignmentById } from './hooks/useAssignmentById';
import { useAssignments } from './hooks/useAssignments';
import type { AssignmentModel } from './models/assignment.model';

const StudentAssignments = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const { assignments } = useAssignments(page);
  const data = assignments?.results;

  // Get logged-in student info
  const { user } = useAppSelector((state) => state.auth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _authUser: any = user;
  const profileId: string | undefined = _authUser?.profile_id;
  const studentClass: string | undefined = _authUser?.class_id;
  const studentSection: string | undefined = _authUser?.section_id;
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { assignmentDetails, isError: isAssignmentError } = useAssignmentById(
    selectedId ?? null,
    skipQuery,
  );
  const route = all_routes;

  useEffect(() => {
    if (isAssignmentError) {
      toast.error('Assignment data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isAssignmentError]);

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Assignment Title',
      align: 'center',
      render: (record: TableData) => record?.title,
      sorter: (a: TableData, b: TableData) => a.title.length - b.title.length,
    },
    {
      title: 'Class',
      align: 'center',
      render: (record: AssignmentModel) => record?.class_name || 'N/A',
    },
    {
      title: 'Subject',
      align: 'center',
      render: (record: AssignmentModel) => record?.subject_name || 'N/A',
    },
    {
      title: 'Total Marks',
      align: 'center',
      render: (record: AssignmentModel) => record?.total_marks || 'N/A',
    },
    {
      title: 'Due Date',
      align: 'center',
      render: (record: AssignmentModel) =>
        record?.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Assigned By',
      align: 'center',
      render: (record: AssignmentModel) => record?.assigned_by_name || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => (
        <>
          {status === 'published' ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Published
            </span>
          ) : status === 'draft' ? (
            <span className="badge badge-soft-warning d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Draft
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Closed
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
            onViewButtonClick={() => {
              setSelectedId(record?.id);
              setActiveModal('view');
            }}
            showEditAction={false}
            showDeleteAction={false}
          />
        </>
      ),
    },
  ];

  // Build subject filter options from current data set
  const subjectOptions: FilterOption[] = useMemo(() => {
    const names = Array.from(
      new Set(
        (data ?? []).map((r: AssignmentModel) => r?.subject_name).filter((v): v is string => !!v),
      ),
    );
    return [{ label: 'All', value: '' }, ...names.map((n) => ({ label: n, value: n }))];
  }, [data]);

  const assignmentFilters: FilterConfig[] = [
    {
      key: 'subject',
      label: 'Subject',
      options: subjectOptions,
      defaultValue: subjectOptions[0] ?? { label: 'All', value: '' },
    },
  ];

  // Filter assignments to show only those assigned to the logged-in student
  const studentAssignments = useMemo(() => {
    if (!data || !profileId) return [];

    return data.filter((assignment: AssignmentModel) => {
      // Check based on target_type
      if (assignment.target_type === 'class') {
        // Show if student's class matches
        return assignment.class_assigned === studentClass;
      } else if (assignment.target_type === 'section') {
        // Show if student's class and section match
        return assignment.class_assigned === studentClass && assignment.section === studentSection;
      } else if (assignment.target_type === 'individual') {
        // Show if student is in the assigned_students list
        return assignment.assigned_students?.some((student) => student.student === profileId);
      }
      return false;
    });
  }, [data, profileId, studentClass, studentSection]);

  const filteredData = useMemo(() => {
    if (!selectedSubject) return studentAssignments ?? [];
    return (studentAssignments ?? []).filter(
      (r: AssignmentModel) => r?.subject_name === selectedSubject,
    );
  }, [studentAssignments, selectedSubject]);

  const sortingOptions = ['Ascending', 'Descending'];

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="My Assignments"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'My Assignments' },
            ]}
          >
            <TooltipOptions showPrint={true} showExport={true} />
          </PageHeader>

          {/* Page Table */}
          {filteredData && filteredData.length > 0 ? (
            <DataTable
              header={
                <DataTableHeader
                  filters={
                    <TableFilter
                      filters={assignmentFilters}
                      onApply={(filters) => {
                        const selected = filters['subject'];
                        setSelectedSubject((selected?.value ?? '').toString());
                      }}
                      onReset={() => {
                        setSelectedSubject('');
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
          ) : (
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <i className="fas fa-info-circle me-3 fs-5"></i>
              <div>
                <h5 className="alert-heading mb-1">No Assignments Found</h5>
                <p className="mb-0">
                  {!studentAssignments || studentAssignments.length === 0
                    ? 'There are no assignments assigned to you at the moment.'
                    : 'No assignments match the selected subject filter. Try changing your filter.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <>
        {/* View Assignment */}
        {assignmentDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Assignment Details"
            header={
              assignmentDetails?.status === 'published' ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Published
                </span>
              ) : assignmentDetails?.status === 'draft' ? (
                <span className="badge badge-soft-warning ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Draft
                </span>
              ) : (
                <span className="badge badge-soft-danger ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Closed
                </span>
              )
            }
            body={<StudentAssignmentDetailsView assignmentData={assignmentDetails} />}
          />
        )}
      </>
    </div>
  );
};

export default StudentAssignments;
