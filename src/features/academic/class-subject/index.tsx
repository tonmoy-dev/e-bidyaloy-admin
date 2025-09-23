import { useEffect, useState } from 'react';
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
import SubjectDetailsView from './components/SubjectDetailsView';
import SubjectForm from './components/SubjectForm';
import { useSubjectById } from './hooks/useGetSubjectByIdQuery';
import { useSubjects } from './hooks/useGetSubjectsQuery';
import { useSubjectMutations } from './hooks/useSubjectMutations';
import { type SubjectModel } from './models/subject.model';

const ClassSubject = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { subjects } = useSubjects(page);
  const data = subjects?.results;
  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createSubject, updateSubject, deleteSubject } = useSubjectMutations();
  const { subjectDetails, isError: isSubjectError } = useSubjectById(selectedId ?? null, skipQuery);
  const route = all_routes;

  useEffect(() => {
    if (isSubjectError) {
      toast.error('Subject data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isSubjectError]);

  const columns = [
    {
      title: 'ID',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Name',
      align: 'center',
      render: (record: TableData) => record?.name,
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: 'Code',
      align: 'center',
      render: (record: TableData) => record?.code,
      sorter: (a: TableData, b: TableData) => a.code.length - b.code.length,
    },
    {
      title: 'Type',
      align: 'center',
      render: (record: TableData) => (
        <span className="text-capitalize">{record?.subject_type}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.subject_type.length - b.subject_type.length,
    },
    {
      title: 'Teacher Count',
      align: 'center',
      render: (record: TableData) => record?.teacher_count || 0,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: 'center',
      render: (text: boolean) => (
        <>
          {text ? (
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
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const typeOptions: FilterOption[] = [
    { label: 'Core', value: 'core' },
    { label: 'Elective', value: 'elective' },
    { label: 'Optional', value: 'optional' },
  ];

  const subjectFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
    {
      key: 'type',
      label: 'Type',
      options: typeOptions,
      defaultValue: typeOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending', 'Recently Added', 'Recently Viewed'];

  const handleSubjectForm = async (data: SubjectModel, mode: string) => {
    console.log('subject data', data);

    try {
      if (mode === 'add') {
        const response = await createSubject(data);
        if (response?.data) {
          toast.success('Subject created successfully');
        }
      } else if (mode === 'edit' && subjectDetails?.id) {
        const response = await updateSubject({ id: subjectDetails?.id, data: data });
        if (response?.data) {
          toast.success('Subject updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSubjectDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteSubject(selectedId);
      if (response) {
        toast.success('Subject deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete subject. Please try again.');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Subjects"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Subjects' },
            ]}
            addButtonLabel="Add Subject"
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
                    filters={subjectFilters}
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
        {/* Add Subject */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Subject Information"
          body={
            <SubjectForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleSubjectForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Subject */}
        {subjectDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Subject Information"
            body={
              <SubjectForm
                mode="edit"
                defaultValues={subjectDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleSubjectForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Subject */}
        {subjectDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Subject Details"
            header={
              subjectDetails?.is_active ? (
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
            body={<SubjectDetailsView subjectData={subjectDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleSubjectDelete}
          title="Delete Subject"
          message="Do you really want to delete this subject? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default ClassSubject;
