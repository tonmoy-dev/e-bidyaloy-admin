import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { MODAL_TYPE } from '../../../core/constants/modal';
import type { TableData } from '../../../core/data/interface';
import PageHeader from '../../../shared/components/layout/PageHeader';
import DeleteConfirmationModal from '../../../shared/components/modals/DeleteConfirmationModal';
import DataTable from '../../../shared/components/table/DataTable';
import DataTableBody from '../../../shared/components/table/DataTableBody';
import DataTableColumnActions from '../../../shared/components/table/DataTableColumnActions';
import type { FilterConfig, FilterOption } from '../../../shared/components/table/DataTableFilter';
import TableFilter from '../../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../../shared/components/table/DataTableFooter';
import DataTableHeader from '../../../shared/components/table/DataTableHeader';
import DataTableModal from '../../../shared/components/table/DataTableModal';
import TooltipOptions from '../../../shared/components/utils/TooltipOptions';
import { all_routes } from '../../router/all_routes';
import ApplicationDetailsView from './components/ApplicationDetailsView';
import ApplicationForm from './components/ApplicationForm';
import { useApplicationById } from './hooks/useApplicationById';
import { useApplicationMutations } from './hooks/useApplicationMutations';
import { useApplication } from './hooks/useApplications';

const AcademicApplication = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { applications } = useApplication();
  const data = useMemo(() => applications?.results ?? [], [applications]);

  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const {
    createApplication,
    updateApplication,
    deleteApplication,
    approveApplication,
    rejectApplication,
  } = useApplicationMutations();

  const { applicationDetails, isError: isApplicationError } = useApplicationById(
    skipQuery ? null : selectedId,
  );

  const route = all_routes;

  useEffect(() => {
    if (isApplicationError) {
      toast.error('Application data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isApplicationError]);

  const getApplicationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: 'Leave',
      transfer: 'Transfer',
      certificate: 'Certificate',
      complaint: 'Complaint',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Rejected
          </span>
        );
      default:
        return (
          <span className="badge badge-soft-warning d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Pending
          </span>
        );
    }
  };

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Subject',
      align: 'left',
      render: (record: TableData) => (
        <div className="d-flex align-items-center">
          <span className="bg-soft-info text-info avatar avatar-sm me-2 br-5 flex-shrink-0">
            <i className="ti ti-file-text fs-16" />
          </span>
          <div>
            <h6 className="mb-0">{record?.subject || 'N/A'}</h6>
            {record?.created_at && (
              <small className="text-muted">
                <i className="ti ti-calendar me-1" />
                Submitted on: {new Date(record.created_at).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.subject.localeCompare(b.subject),
    },
    {
      title: 'Type',
      align: 'center',
      render: (record: TableData) => (
        <span className="badge badge-soft-primary">
          {getApplicationTypeLabel(record?.application_type)}
        </span>
      ),
    },
    {
      title: 'Applicant',
      align: 'center',
      render: (record: TableData) => (
        <div>
          <p className="mb-0">{record?.applicant_name || 'N/A'}</p>
          {record?.applicant_email && (
            <small className="text-muted">{record.applicant_email}</small>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Attachment',
      align: 'center',
      render: (record: TableData) => (
        <>
          {record?.attachment ? (
            <i className="ti ti-paperclip text-primary fs-16" />
          ) : (
            <span className="text-muted">-</span>
          )}
        </>
      ),
    },
    {
      title: 'Action',
      align: 'center',
      render: (record: TableData) => (
        <>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <button
              className="btn btn-sm btn-icon btn-light"
              onClick={() => {
                setSelectedId(record?.id);
                setActiveModal('view');
              }}
              title="View"
            >
              <i className="ti ti-eye" />
            </button>

            {record?.status === 'pending' && (
              <>
                <button
                  className="btn btn-sm btn-icon btn-success"
                  onClick={async () => {
                    try {
                      const response = await approveApplication(record?.id);
                      if (response?.data) {
                        toast.success('Application approved successfully');
                      }
                    } catch (error) {
                      toast.error('Failed to approve application');
                    }
                  }}
                  title="Approve"
                >
                  <i className="ti ti-check" />
                </button>

                <button
                  className="btn btn-sm btn-icon btn-danger"
                  onClick={async () => {
                    try {
                      const response = await rejectApplication({ id: record?.id });
                      if (response?.data) {
                        toast.success('Application rejected successfully');
                      }
                    } catch (error) {
                      toast.error('Failed to reject application');
                    }
                  }}
                  title="Reject"
                >
                  <i className="ti ti-x" />
                </button>
              </>
            )}

            <DataTableColumnActions
              onEditButtonClick={() => {
                setSelectedId(record?.id);
                setActiveModal('edit');
              }}
              onDeleteButtonClick={() => {
                setSelectedId(record?.id);
                setActiveModal('delete');
              }}
              hideViewButton
            />
          </div>
        </>
      ),
    },
  ];

  // Build type filter options
  const typeOptions: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Leave', value: 'leave' },
    { label: 'Transfer', value: 'transfer' },
    { label: 'Certificate', value: 'certificate' },
    { label: 'Complaint', value: 'complaint' },
    { label: 'Other', value: 'other' },
  ];

  // Build status filter options
  const statusOptions: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const applicationFilters: FilterConfig[] = [
    {
      key: 'type',
      label: 'Application Type',
      options: typeOptions,
      defaultValue: typeOptions[0],
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      defaultValue: statusOptions[0],
    },
  ];

  const filteredData = useMemo(() => {
    let filtered = data ?? [];

    if (selectedType) {
      filtered = filtered.filter((r: TableData) => r?.application_type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter((r: TableData) => r?.status === selectedStatus);
    }

    return filtered;
  }, [data, selectedType, selectedStatus]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleApplicationForm = async (formData: FormData, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createApplication(formData);
        if (response?.data) {
          toast.success('Application submitted successfully');
        }
      } else if (mode === 'edit' && applicationDetails?.id) {
        const response = await updateApplication({
          id: applicationDetails?.id,
          data: formData,
        });
        if (response?.data) {
          toast.success('Application updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleApplicationDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteApplication(selectedId);
      if (!response?.error) {
        toast.success('Application deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete application');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Application Board"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Management', path: '#' },
              { label: 'Application Board' },
            ]}
            addButtonLabel="Add Application"
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
                    filters={applicationFilters}
                    onApply={(filters) => {
                      const type = filters['type'];
                      const status = filters['status'];
                      setSelectedType((type?.value ?? '').toString());
                      setSelectedStatus((status?.value ?? '').toString());
                    }}
                    onReset={() => {
                      setSelectedType('');
                      setSelectedStatus('');
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
        {/* Add Application */}
        <DataTableModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Application"
          body={
            <ApplicationForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (formData) => {
                await handleApplicationForm(formData, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Application */}
        {applicationDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Application"
            body={
              <ApplicationForm
                mode="edit"
                defaultValues={applicationDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (formData) => {
                  await handleApplicationForm(formData, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Application */}
        {applicationDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Application Details"
            header={getStatusBadge(applicationDetails?.status || 'pending')}
            body={<ApplicationDetailsView applicationData={applicationDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleApplicationDelete}
          title="Delete Application"
          message="Do you really want to delete this application? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default AcademicApplication;
