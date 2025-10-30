import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';


import NoticeDetailsView from './components/NoticeDetailsView';
import NoticeForm from './components/NoticeForm';
import { useNotice } from './hooks/useNotice';
import { useNoticeById } from './hooks/useNoticeById';
import { useNoticeMutations } from './hooks/useNoticeMutations';
import type { ModalType } from '../../shared/components/table/DataTableModal';
import { MODAL_TYPE } from '../../core/constants/modal';
import { all_routes } from '../router/all_routes';
import type { TableData } from '../../core/data/interface';
import DataTableColumnActions from '../../shared/components/table/DataTableColumnActions';
import type { FilterConfig, FilterOption } from '../../shared/components/table/DataTableFilter';
import PageHeader from '../../shared/components/layout/PageHeader';
import TooltipOptions from '../../shared/components/utils/TooltipOptions';
import DataTable from '../../shared/components/table/DataTable';
import DataTableHeader from '../../shared/components/table/DataTableHeader';
import TableFilter from '../../shared/components/table/DataTableFilter';
import DataTableFooter from '../../shared/components/table/DataTableFooter';
import DataTableBody from '../../shared/components/table/DataTableBody';
import DataTableModal from '../../shared/components/table/DataTableModal';
import DeleteConfirmationModal from '../../shared/components/modals/DeleteConfirmationModal';

const NoticeBoard = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { notices } = useNotice();
  const data = useMemo(() => notices?.results ?? [], [notices]);

  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createNotice, updateNotice, deleteNotice } = useNoticeMutations();

  const { noticeDetails, isError: isNoticeError } = useNoticeById(skipQuery ? null : selectedId);

  const route = all_routes;

  useEffect(() => {
    if (isNoticeError) {
      toast.error('Notice data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isNoticeError]);

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      students: 'Students',
      teachers: 'Teachers',
      parents: 'Parents',
      all: 'All',
    };
    return labels[audience] || audience;
  };

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Title',
      align: 'left',
      render: (record: TableData) => (
        <div className="d-flex align-items-center">
          <span className="bg-soft-primary text-primary avatar avatar-sm me-2 br-5 flex-shrink-0">
            <i className="ti ti-notification fs-16" />
          </span>
          <div>
            <h6 className="mb-0">{record?.title || 'N/A'}</h6>
            {record?.created_at && (
              <small className="text-muted">
                <i className="ti ti-calendar me-1" />
                Added on: {new Date(record.created_at).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.title.localeCompare(b.title),
    },
    {
      title: 'Audience',
      align: 'center',
      render: (record: TableData) => (
        <span className="badge badge-soft-primary">{getAudienceLabel(record?.audience)}</span>
      ),
    },
    {
      title: 'Publish Date',
      align: 'center',
      render: (record: TableData) =>
        record?.publish_date ? new Date(record.publish_date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Expiry Date',
      align: 'center',
      render: (record: TableData) => (
        <>
          {record?.expiry_date ? (
            <>
              {new Date(record.expiry_date).toLocaleDateString()}
              {new Date(record.expiry_date) < new Date() && (
                <span className="badge badge-soft-danger ms-2 d-block mt-1">Expired</span>
              )}
            </>
          ) : (
            'N/A'
          )}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_published',
      align: 'center',
      render: (is_published: boolean) => (
        <>
          {is_published ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Published
            </span>
          ) : (
            <span className="badge badge-soft-warning d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Draft
            </span>
          )}
        </>
      ),
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

  // Build audience filter options
  const audienceOptions: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Students', value: 'students' },
    { label: 'Teachers', value: 'teachers' },
    { label: 'Parents', value: 'parents' },
    { label: 'All Users', value: 'all' },
  ];

  // Build status filter options
  const statusOptions: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Published', value: 'true' },
    { label: 'Draft', value: 'false' },
  ];

  const noticeFilters: FilterConfig[] = [
    {
      key: 'audience',
      label: 'Audience',
      options: audienceOptions,
      defaultValue: audienceOptions[0],
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

    if (selectedAudience) {
      filtered = filtered.filter((r: TableData) => r?.audience === selectedAudience);
    }

    if (selectedStatus) {
      const isPublished = selectedStatus === 'true';
      filtered = filtered.filter((r: TableData) => r?.is_published === isPublished);
    }

    return filtered;
  }, [data, selectedAudience, selectedStatus]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleNoticeForm = async (formData: FormData, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createNotice(formData);
        if (response?.data) {
          toast.success('Notice created successfully');
        }
      } else if (mode === 'edit' && noticeDetails?.id) {
        const response = await updateNotice({
          id: noticeDetails?.id,
          data: formData,
        });
        if (response?.data) {
          toast.success('Notice updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleNoticeDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deleteNotice(selectedId);
      if (!response?.error) {
        toast.success('Notice deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Notice Board"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Announcement', path: '#' },
              { label: 'Notice Board' },
            ]}
            addButtonLabel="Add Notice"
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
                    filters={noticeFilters}
                    onApply={(filters) => {
                      const audience = filters['audience'];
                      const status = filters['status'];
                      setSelectedAudience((audience?.value ?? '').toString());
                      setSelectedStatus((status?.value ?? '').toString());
                    }}
                    onReset={() => {
                      setSelectedAudience('');
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
        {/* Add Notice */}
        <DataTableModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Notice"
          body={
            <NoticeForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (formData) => {
                await handleNoticeForm(formData, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Notice */}
        {noticeDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Notice"
            body={
              <NoticeForm
                mode="edit"
                defaultValues={noticeDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (formData) => {
                  await handleNoticeForm(formData, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Notice */}
        {noticeDetails?.id && (
          <DataTableModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Notice Details"
            header={
              noticeDetails?.is_published ? (
                <span className="badge badge-soft-success ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Published
                </span>
              ) : (
                <span className="badge badge-soft-warning ms-2">
                  <i className="ti ti-circle-filled me-1 fs-5" />
                  Draft
                </span>
              )
            }
            body={<NoticeDetailsView noticeData={noticeDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleNoticeDelete}
          title="Delete Notice"
          message="Do you really want to delete this notice? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default NoticeBoard;
