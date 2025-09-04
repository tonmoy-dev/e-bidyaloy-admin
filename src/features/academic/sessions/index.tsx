import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useAuth } from '../../../shared/hooks/useAuth';
import { all_routes } from '../../router/all_routes';
import SessionForm from './components/SessionForm';
import { useSessionById } from './hooks/useSessionById';
import { useSessionMutations } from './hooks/useSessionMutations';
import { useSessions } from './hooks/useSessions';
import type { SessionModel } from './models/session.model';
const page = 1;

const Sessiones = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const authData = useAuth();

  const { sessions, isLoading } = useSessions(page);
  const { sessionDetails } = useSessionById(selectedId ?? -1);
  const { createSession, updateSession, deleteSession } = useSessionMutations();

  const data = sessions?.results;
  const route = all_routes;
  console.log('authData', authData);
  // console.log('sessionesData', sessiones);
  // console.log('isLoading', isLoading);
  // console.log('error', error);

  // console.log('sessionDetails', sessionDetails);
  console.log('selectedId', selectedId);
  console.log('activeModal', activeModal);

  const columns = [
    {
      title: 'SL',
      dataIndex: 'id',
      align: 'center',
      render: (record: TableData) => (
        <>
          <Link to="#" className="link-primary">
            {record.id}
          </Link>
        </>
      ),
    },

    {
      title: 'Session',
      dataIndex: 'session',
      align: 'center',
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text: string) => (
        <>
          {text === 'Active' ? (
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
    },
    {
      title: 'Action',
      dataIndex: 'action',
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
    console.log('session', data);
    try {
      if (mode === 'add') {
        const response = await createSession(data);
        console.log('response', response);
      } else if (mode === 'edit' && data?.id) {
        const response = await updateSession({ id: data?.id, data: data });
        console.log('response', response);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSessionDelete = async () => {
    const response = await deleteSession(selectedId ?? -1);
    console.log('response', response);
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
            title="Sessiones"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Sessiones', path: '#' },
              { label: 'All Sessiones' },
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
        {/* Add Sessiones */}
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
                setActiveModal(null); // close only on success
              }}
            />
          }
        />

        {/* Edit Sessiones */}
        <DataModal
          show={activeModal === MODAL_TYPE.EDIT}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          modalTitle="Edit Session"
          body={
            <SessionForm
              mode="edit"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleSessionForm(data, 'edit');
                setActiveModal(null);
                setSelectedId(null);
              }}
            />
          }
        />

        {/* View Sessiones */}
        <DataModal
          show={activeModal === MODAL_TYPE.VIEW}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          modalTitle="Session Details"
          header={
            <span className="badge badge-soft-success ms-2">
              <i className="ti ti-circle-filled me-1 fs-5" />
              Active
            </span>
          }
          body={
            <>
              {sessionDetails && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="session-detail-info">
                      <p>Session Name</p>
                      <span>III</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="session-detail-info">
                      <p>Section</p>
                      <span>A</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="session-detail-info">
                      <p>No of Subjects</p>
                      <span>05</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="session-detail-info">
                      <p>No of Students</p>
                      <span>25</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          }
        />

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

export default Sessiones;
