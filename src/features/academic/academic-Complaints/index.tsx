import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { MODAL_TYPE } from '../../../core/constants/modal';
import type { TableData } from '../../../core/data/interface';
import { useAppSelector } from '../../../core/store';
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
import { useUserRole } from '../../../shared/hooks/useUserRole';
import { all_routes } from '../../router/all_routes';
import ComplaintDetailsView from './components/ComplaintDetailsView';
import ComplaintForm from './components/ComplaintForm';
import { useComplaintById } from './hooks/useComplaintById';
import { useComplaintMutations } from './hooks/useComplaintMutations';
import { useComplaints } from './hooks/useComplaints';

const AcademicComplaint = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Get user from Redux store
  const { user } = useAppSelector((state) => state.auth);

  // Get user role
  const { isAdmin } = useUserRole();

  const { complaints } = useComplaints();
  const data = useMemo(() => complaints?.results ?? [], [complaints]);

  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createComplaint, updateComplaint, deleteComplaint, markComplaintResolved } =
    useComplaintMutations();

  const { complaintDetails, isError: isComplaintError } = useComplaintById(
    skipQuery ? null : selectedId,
  );

  const route = all_routes;

  useEffect(() => {
    if (isComplaintError) {
      toast.error('Complaint data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isComplaintError]);

  const getComplaintTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      academic: 'Academic',
      facility: 'Facility',
      behavior: 'Behavioral',
      transport: 'Transport',
      administrative: 'Administrative',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Resolved
          </span>
        );
      case 'in_progress':
        return (
          <span className="badge badge-soft-info d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            In Progress
          </span>
        );
      case 'closed':
        return (
          <span className="badge badge-soft-secondary d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Closed
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
          <span className="bg-soft-danger text-danger avatar avatar-sm me-2 br-5 flex-shrink-0">
            <i className="ti ti-alert-circle fs-16" />
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
          {getComplaintTypeLabel(record?.complaint_type)}
        </span>
      ),
    },
    {
      title: 'Complainant',
      align: 'center',
      render: (record: TableData) => (
        <div>
          <p className="mb-0">{record?.complainant_name || 'N/A'}</p>
          {record?.complainant_email && (
            <small className="text-muted">{record.complainant_email}</small>
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
            {/* <button
              className="btn btn-sm btn-icon btn-light"
              onClick={() => {
                setSelectedId(record?.id);
                setActiveModal('view');
              }}
              title="View"
            >
              <i className="ti ti-eye" />
            </button> */}

            {record?.status !== 'resolved' && record?.status !== 'closed' && isAdmin && (
              <button
                className="btn btn-sm btn-icon btn-success"
                onClick={async () => {
                  try {
                    const response = await markComplaintResolved({
                      id: record?.id,
                      response_message: 'Complaint has been resolved.',
                    });
                    if (response?.data) {
                      toast.success('Complaint marked as resolved successfully');
                    }
                  } catch (error) {
                    toast.error('Failed to resolve complaint');
                  }
                }}
                title="Mark as Resolved"
              >
                <i className="ti ti-check" />
              </button>
            )}

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
    { label: 'Academic', value: 'academic' },
    { label: 'Facility', value: 'facility' },
    { label: 'Behavioral', value: 'behavior' },
    { label: 'Transport', value: 'transport' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Other', value: 'other' },
  ];

  // Build status filter options
  const statusOptions: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ];

  const complaintFilters: FilterConfig[] = [
    {
      key: 'type',
      label: 'Complaint Type',
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
      filtered = filtered.filter((r: TableData) => r?.complaint_type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter((r: TableData) => r?.status === selectedStatus);
    }

    return filtered;
  }, [data, selectedType, selectedStatus]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleComplaintForm = async (formData: FormData, mode: string) => {
    try {
      // Add complainant ID to formData for create operation
      if (mode === 'add' && user?.id) {
        formData.append('complainant', user.id);
      }

      if (mode === 'add') {
        const response = await createComplaint(formData);
        if (response?.data) {
          toast.success('Complaint submitted successfully');
        }
      } else if (mode === 'edit' && complaintDetails?.id) {
        const response = await updateComplaint({
          id: complaintDetails?.id,
          data: formData,
        });
        if (response?.data) {
          toast.success('Complaint updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleComplaintDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteComplaint(selectedId);
      if (!response?.error) {
        toast.success('Complaint deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete complaint');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Complaint Management"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Management', path: '#' },
              { label: 'Complaints' },
            ]}
            addButtonLabel="Add Complaint"
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
                    filters={complaintFilters}
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
        {/* Add Complaint */}
        <DataTableModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Complaint"
          body={
            <ComplaintForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (formData) => {
                await handleComplaintForm(formData, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Complaint */}
        {complaintDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Complaint"
            body={
              <ComplaintForm
                mode="edit"
                defaultValues={complaintDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (formData) => {
                  await handleComplaintForm(formData, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Complaint */}
        {complaintDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Complaint Details"
            header={getStatusBadge(complaintDetails?.status || 'pending')}
            body={<ComplaintDetailsView complaintData={complaintDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleComplaintDelete}
          title="Delete Complaint"
          message="Do you really want to delete this complaint? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default AcademicComplaint;
