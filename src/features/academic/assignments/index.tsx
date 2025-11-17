import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
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
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../router/all_routes';
import AssignmentDetailsView from './components/AssignmentDetailsView';
import AssignmentForm from './components/AssignmentForm';
import GradeSubmissionsModal from './components/GradeSubmissionsModal';
import { useAssignmentById } from './hooks/useAssignmentById';
import { useAssignmentMutations } from './hooks/useAssignmentMutations';
import { useAssignments } from './hooks/useAssignments';
import type { AssignmentFormData, AssignmentModel } from './models/assignment.model';

const Assignments = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const { assignments } = useAssignments(page);
  const data = assignments?.results;
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createAssignment, updateAssignment, deleteAssignment } = useAssignmentMutations();
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
      title: 'Section',
      align: 'center',
      render: (record: AssignmentModel) => record?.section_name || 'N/A',
    },
    {
      title: 'Subject',
      align: 'center',
      render: (record: AssignmentModel) => record?.subject_name || 'N/A',
    },
    {
      title: 'Target Type',
      align: 'center',
      render: (record: AssignmentModel) => (
        <span className="text-capitalize">{record?.target_type || 'N/A'}</span>
      ),
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
          <div className="d-flex gap-2 justify-content-center">
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
            <button
              className="btn btn-sm btn-success"
              title="Grade Assignment"
              onClick={() => {
                setSelectedId(record?.id);
                setActiveModal(MODAL_TYPE.GRADE as ModalType);
              }}
            >
              <i className="fas fa-award me-1"></i>
              Grade
            </button>
          </div>
        </>
      ),
    },
  ];

  // Build class filter options from current data set
  const classOptions: FilterOption[] = useMemo(() => {
    const names = Array.from(
      new Set(
        (data ?? []).map((r: AssignmentModel) => r?.class_name).filter((v): v is string => !!v),
      ),
    );
    return [{ label: 'All', value: '' }, ...names.map((n) => ({ label: n, value: n }))];
  }, [data]);

  const assignmentFilters: FilterConfig[] = [
    {
      key: 'class',
      label: 'Class',
      options: classOptions,
      defaultValue: classOptions[0] ?? { label: 'All', value: '' },
    },
  ];

  const filteredData = useMemo(() => {
    if (!selectedClass) return data ?? [];
    return (data ?? []).filter((r: AssignmentModel) => r?.class_name === selectedClass);
  }, [data, selectedClass]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleAssignmentForm = async (
    data: AssignmentFormData,
    mode: string,
  ): Promise<
    { createdAssignment?: AssignmentModel; shouldUploadAttachments?: boolean } | undefined
  > => {
    try {
      if (mode === 'add') {
        // Create assignment without attachments first
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { attachments, ...assignmentData } = data;
        const response = await createAssignment(assignmentData);
        if (response?.data && response.data.id) {
          toast.success('Assignment created successfully');
          return {
            createdAssignment: response.data,
            shouldUploadAttachments: false,
          };
        }
      } else if (mode === 'edit' && assignmentDetails?.id) {
        const response = await updateAssignment({ id: assignmentDetails?.id, data });
        if (response?.data) {
          toast.success('Assignment updated successfully');
          setActiveModal(null);
        }
      }
      return undefined;
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
      return undefined;
    }
  };

  const handleAssignmentDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteAssignment(selectedId);
      if (!response?.error) {
        toast.success('Assignment deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Assignments"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Assignments' },
            ]}
            addButtonLabel="Add Assignment"
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
                    filters={assignmentFilters}
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
        {/* Add Assignment */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="xl"
          modalTitle="Add Assignment Information"
          body={
            <AssignmentForm
              mode="add"
              onActiveModal={(modal) => setActiveModal(modal as ModalType)}
              onSubmit={async (data) => {
                return await handleAssignmentForm(data, 'add');
              }}
            />
          }
        />

        {/* Edit Assignment */}
        {assignmentDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Update Assignment Information"
            body={
              <AssignmentForm
                mode="edit"
                defaultValues={assignmentDetails}
                onActiveModal={(modal) => setActiveModal(modal as ModalType)}
                onSubmit={async (data) => {
                  return await handleAssignmentForm(data, 'edit');
                }}
              />
            }
          />
        )}

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
            body={<AssignmentDetailsView assignmentData={assignmentDetails} />}
          />
        )}

        {/* Grade Submissions Modal */}
        {assignmentDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.GRADE}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="xl"
            modalTitle="Grade Submissions"
            body={
              <GradeSubmissionsModal
                assignmentData={assignmentDetails}
                onClose={() => setActiveModal(null)}
              />
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
          onConfirm={handleAssignmentDelete}
          title="Delete Assignment"
          message="Do you really want to delete this assignment? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Assignments;
