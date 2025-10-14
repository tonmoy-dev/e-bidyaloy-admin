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
import GradeDetailsView from './components/GradeDetailsView';
import GradeForm from './components/GradeForm';
import { useGradeById } from './hooks/useGetGradeById';
import { useGradesList } from './hooks/useGetGradesList';
import { useGradeMutations } from './hooks/useGradeMutations';
import { type GradeModel } from './models/grade.model';

const Grades = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { grades } = useGradesList(page);
  const data = grades?.results;
  const skipQuery = !selectedId || activeModal === MODAL_TYPE.DELETE;
  const { createGrade, updateGrade, deleteGrade } = useGradeMutations();
  const {
    gradeDetails,
    isError: isGradeError,
    isLoading: isGradeLoading,
  } = useGradeById(selectedId ?? null, skipQuery);
  const route = all_routes;

  useEffect(() => {
    if (isGradeError) {
      toast.error('Grade data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isGradeError]);

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
      title: 'Level',
      align: 'center',
      render: (record: TableData) => record?.level,
      sorter: (a: TableData, b: TableData) => a.level - b.level,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: 'center',
      render: (isActive: boolean) => {
        if (isActive) {
          return (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          );
        }
        return (
          <span className="badge badge-soft-secondary d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Inactive
          </span>
        );
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
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const gradeFilters: FilterConfig[] = [
    {
      key: 'is_active',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending', 'Recently Added', 'Recently Viewed'];

  const handleGradeForm = async (data: GradeModel, mode: string) => {
    console.log('grade data', data);

    try {
      if (mode === 'add') {
        const response = await createGrade(data);
        if (response?.data) {
          toast.success('Grade created successfully');
        }
      } else if (mode === 'edit' && gradeDetails?.id) {
        const response = await updateGrade({ id: gradeDetails?.id, data: data });
        if (response?.data) {
          toast.success('Grade updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleGradeDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteGrade(selectedId);
      if (response) {
        toast.success('Grade deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete grade. Please try again.');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Grades"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Academic', path: '#' },
              { label: 'Grades' },
            ]}
            addButtonLabel="Add Grade"
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
                    filters={gradeFilters}
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
        {/* Add Grade */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Grade Information"
          body={
            <GradeForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleGradeForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Grade */}
        {activeModal === MODAL_TYPE.EDIT && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Grade Information"
            body={
              isGradeLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading grade details...</p>
                </div>
              ) : gradeDetails?.id ? (
                <GradeForm
                  mode="edit"
                  defaultValues={gradeDetails}
                  onActiveModal={setActiveModal}
                  onSubmit={async (data) => {
                    await handleGradeForm(data, 'edit');
                    setActiveModal(null);
                    setSelectedId(null);
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load grade details.</p>
                </div>
              )
            }
          />
        )}

        {/* View Grade */}
        {activeModal === MODAL_TYPE.VIEW && (
          <DataModal
            show={true}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Grade Details"
            header={
              gradeDetails?.is_active ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Active
                </span>
              ) : (
                <span className="badge badge-soft-secondary ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Inactive
                </span>
              )
            }
            body={
              isGradeLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading grade details...</p>
                </div>
              ) : gradeDetails?.id ? (
                <GradeDetailsView gradeData={gradeDetails} />
              ) : (
                <div className="text-center py-5">
                  <p>Failed to load grade details.</p>
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
          onConfirm={handleGradeDelete}
          title="Delete Grade"
          message="Do you really want to delete this grade? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Grades;
