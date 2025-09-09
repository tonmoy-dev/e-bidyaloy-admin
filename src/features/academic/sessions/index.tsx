import { useState } from 'react';
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
import PageLoader from '../../../shared/components/utils/PageLoader';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../router/all_routes';
import SessionDetailsView from './components/SessionDetailsView';
import SessionForm from './components/SessionForm';
import { useSessionById } from './hooks/useSessionById';
import { useSessionMutations } from './hooks/useSessionMutations';
import { useSessions } from './hooks/useSessions';
import type { SessionModel } from './models/session.model';
const page = 1;

const Sessions = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // const authData = useAuth();

  const { sessions, isLoading } = useSessions(page);
  const { sessionDetails } = useSessionById(selectedId ?? -1);
  const { createSession, updateSession, deleteSession } = useSessionMutations();

  const data = sessions?.results;
  const route = all_routes;

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Name',
      align: 'center',
      render: (record: TableData) => record?.name,
    },
    {
      title: 'Start Date',
      align: 'center',
      render: (record: TableData) => record?.start_date,
    },
    {
      title: 'End Date',
      align: 'center',
      render: (record: TableData) => record?.end_date,
    },
    {
      title: 'Status',
      dataIndex: 'is_current',
      align: 'center',
      render: (text: string) => (
        <>
          {text ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData) => (a.is_current ? 1 : 0),
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

  const sessionFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const sortingOptions = ['Ascending', 'Descending'];

  const handleSessionForm = async (data: SessionModel, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createSession(data);
        if (response?.data) {
          toast.success('Session created successfully');
        }
      } else if (mode === 'edit' && sessionDetails?.id) {
        const response = await updateSession({ id: sessionDetails?.id, data: data });
        if (response?.data) {
          toast.success('Session updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSessionDelete = async () => {
    const response = await deleteSession(selectedId ?? -1);
    if (!response?.data) {
      toast.success('Session deleted successfully');
      setActiveModal(null);
      setSelectedId(null);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Sessions"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Sessions', path: '#' },
              { label: 'All Sessions' },
            ]}
            addButtonLabel="Add Session"
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
                    filters={sessionFilters}
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
        {/* Add Sessions */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="md"
          modalTitle="Add Session"
          body={
            <SessionForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleSessionForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Sessions */}
        {sessionDetails && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Edit Session"
            body={
              <SessionForm
                defaultValues={sessionDetails}
                mode="edit"
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleSessionForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Sessions */}
        {sessionDetails && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            modalTitle="Session Details"
            header={
              sessionDetails?.is_current ? (
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
            body={sessionDetails && <SessionDetailsView sessionData={sessionDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleSessionDelete}
          title="Delete Item"
          message="Do you really want to delete? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default Sessions;
