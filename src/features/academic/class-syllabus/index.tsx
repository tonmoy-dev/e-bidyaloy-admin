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
import { useClassesWithoutPagination } from '../class-subject/hooks/useGetClassesQueryWP';
import SyllabusDetailsView from './components/SyllabusDetailsView';
import SyllabusForm from './components/SyllabusForm';
import { useSyllabusById } from './hooks/useGetSyllabusById';
import { useSyllabusList } from './hooks/useGetSyllabusList';
import { useSyllabusMutations } from './hooks/useSyllabusMutations';
import { useSubjectsWithoutPagination } from './hooks/useSubjectsWP';
import { type SyllabusModel } from './models/syllabus.model';

const ClassSyllabus = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { syllabuses } = useSyllabusList(page);
  const data = syllabuses?.results;
  const skipQuery = !selectedId || activeModal === MODAL_TYPE.DELETE;
  const { createSyllabus, updateSyllabus, deleteSyllabus } = useSyllabusMutations();
  const {
    syllabusDetails,
    isError: isSyllabusError,
    isLoading: isSyllabusLoading,
  } = useSyllabusById(selectedId ?? null, skipQuery);
  const route = all_routes;

  // Fetch classes and subjects for ID to name mapping
  const { classes } = useClassesWithoutPagination();
  const { subjects } = useSubjectsWithoutPagination();

  // Helper functions to get names from IDs
  const getClassName = (classId: string) => {
    const classItem = classes?.find((c) => c.id === classId);
    return classItem?.name || 'N/A';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects?.find((s) => s.id === subjectId);
    return subject?.name || 'N/A';
  };

  useEffect(() => {
    if (isSyllabusError) {
      toast.error('Syllabus data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isSyllabusError]);

  const columns = [
    {
      title: 'ID',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Title',
      align: 'center',
      render: (record: TableData) => record?.title,
      sorter: (a: TableData, b: TableData) => a.title.length - b.title.length,
    },
    {
      title: 'Subject',
      align: 'center',
      render: (record: TableData) => getSubjectName(record?.subject),
      sorter: (a: TableData, b: TableData) =>
        getSubjectName(a.subject).localeCompare(getSubjectName(b.subject)),
    },
    {
      title: 'Class',
      align: 'center',
      render: (record: TableData) => getClassName(record?.classes),
      sorter: (a: TableData, b: TableData) =>
        getClassName(a.classes).localeCompare(getClassName(b.classes)),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text: string) => {
        switch (text) {
          case 'published':
            return (
              <span className="badge badge-soft-success d-inline-flex align-items-center">
                <i className="ti ti-circle-filled fs-5 me-1"></i>
                Published
              </span>
            );
          case 'draft':
            return (
              <span className="badge badge-soft-warning d-inline-flex align-items-center">
                <i className="ti ti-circle-filled fs-5 me-1"></i>
                Draft
              </span>
            );
          case 'archived':
            return (
              <span className="badge badge-soft-secondary d-inline-flex align-items-center">
                <i className="ti ti-circle-filled fs-5 me-1"></i>
                Archived
              </span>
            );
          default:
            return (
              <span className="badge badge-soft-secondary d-inline-flex align-items-center">
                <i className="ti ti-circle-filled fs-5 me-1"></i>
                {text}
              </span>
            );
        }
      },
    },
    {
      title: 'Created Date',
      align: 'center',
      render: (record: TableData) =>
        record?.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A',
      sorter: (a: TableData, b: TableData) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ];

  const syllabusFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending', 'Recently Added', 'Recently Viewed'];

  const handleSyllabusForm = async (data: SyllabusModel, mode: string) => {
    console.log('syllabus data', data);

    try {
      if (mode === 'add') {
        const response = await createSyllabus(data);
        if (response?.data) {
          toast.success('Syllabus created successfully');
        }
      } else if (mode === 'edit' && syllabusDetails?.id) {
        const response = await updateSyllabus({ id: syllabusDetails?.id, data: data });
        if (response?.data) {
          toast.success('Syllabus updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSyllabusDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteSyllabus(selectedId);
      if (response) {
        toast.success('Syllabus deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete syllabus. Please try again.');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Class Syllabus"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Class Syllabus' },
            ]}
            addButtonLabel="Add Syllabus"
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
                    filters={syllabusFilters}
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
        {/* Add Syllabus */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Syllabus Information"
          body={
            <SyllabusForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleSyllabusForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Syllabus */}
        {activeModal === MODAL_TYPE.EDIT && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Syllabus Information"
            body={
              isSyllabusLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading syllabus details...</p>
                </div>
              ) : syllabusDetails?.id ? (
                <SyllabusForm
                  mode="edit"
                  defaultValues={syllabusDetails}
                  onActiveModal={setActiveModal}
                  onSubmit={async (data) => {
                    await handleSyllabusForm(data, 'edit');
                    setActiveModal(null);
                    setSelectedId(null);
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load syllabus details.</p>
                </div>
              )
            }
          />
        )}

        {/* View Syllabus */}
        {activeModal === MODAL_TYPE.VIEW && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Syllabus Details"
            header={
              syllabusDetails?.status === 'published' ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Published
                </span>
              ) : syllabusDetails?.status === 'draft' ? (
                <span className="badge badge-soft-warning ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Draft
                </span>
              ) : (
                <span className="badge badge-soft-secondary ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Archived
                </span>
              )
            }
            body={
              isSyllabusLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading syllabus details...</p>
                </div>
              ) : syllabusDetails?.id ? (
                <SyllabusDetailsView syllabusData={syllabusDetails} />
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load syllabus details.</p>
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
          onConfirm={handleSyllabusDelete}
          title="Delete Syllabus"
          message="Do you really want to delete this syllabus? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default ClassSyllabus;
