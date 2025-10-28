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
import PaymentGatewayDetailsView from './components/PaymentGatewayDetailsView';
import PaymentGatewayForm from './components/PaymentGatewayForm';
import { usePaymentGateway } from './hooks/usePaymentGateway';
import { usePaymentGatewayById } from './hooks/usePaymentGatewayById';
import { usePaymentGatewayMutations } from './hooks/usePaymentGatewayMutations';
import type { PaymentGatewayModel } from './models/paymentGateway.model';

const PaymentGateways = () => {
  const page = 1;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>('');

  const { paymentGateway } = usePaymentGateway(page);
  const data = paymentGateway;

  const skipQuery = activeModal === MODAL_TYPE.DELETE;
  const { createPaymentGateway, updatePaymentGateway, deletePaymentGateway } =
    usePaymentGatewayMutations();

  const { paymentGatewayDetails, isError: isGatewayError } = usePaymentGatewayById(
    selectedId ?? null,
    skipQuery,
  );

  const route = all_routes;

  useEffect(() => {
    if (isGatewayError) {
      toast.error('Payment Gateway data not found!');
    }

    return () => {
      setActiveModal(null);
      setSelectedId(null);
    };
  }, [isGatewayError]);

  const columns = [
    {
      title: 'SL',
      align: 'center',
      render: (_: TableData, __: TableData, index: number) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Gateway Name',
      align: 'center',
      render: (record: TableData) => (
        <span className="text-capitalize">{record?.gateway_name}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.gateway_name.localeCompare(b.gateway_name),
    },
    {
      title: 'Store ID',
      align: 'center',
      render: (record: TableData) => record?.store_id || 'N/A',
    },
    {
      title: 'Currency',
      align: 'center',
      render: (record: TableData) => record?.currency || 'N/A',
    },
    {
      title: 'Mode',
      align: 'center',
      render: (record: TableData) => (
        <>
          {record?.sandbox_mode ? (
            <span className="badge badge-soft-warning d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Sandbox
            </span>
          ) : (
            <span className="badge badge-soft-info d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Live
            </span>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: 'center',
      render: (is_active: boolean) => (
        <>
          {is_active ? (
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
      title: 'Organization',
      align: 'center',
      render: (record: TableData) => record?.organization_name || 'N/A',
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

  // Build gateway filter options from current data set
  const gatewayOptions: FilterOption[] = useMemo(() => {
    const names = Array.from(
      new Set((data ?? []).map((r: TableData) => r?.gateway_name).filter((v): v is string => !!v)),
    );
    return [
      { label: 'All', value: '' },
      ...names.map((n) => ({
        label: n.charAt(0).toUpperCase() + n.slice(1),
        value: n,
      })),
    ];
  }, [data]);

  const gatewayFilters: FilterConfig[] = [
    {
      key: 'gateway',
      label: 'Gateway',
      options: gatewayOptions,
      defaultValue: gatewayOptions[0] ?? { label: 'All', value: '' },
    },
  ];

  const filteredData = useMemo(() => {
    if (!selectedGateway) return data ?? [];
    return (data ?? []).filter((r: TableData) => r?.gateway_name === selectedGateway);
  }, [data, selectedGateway]);

  const sortingOptions = ['Ascending', 'Descending'];

  const handleGatewayForm = async (data: Omit<PaymentGatewayModel, 'id'>, mode: string) => {
    try {
      if (mode === 'add') {
        const response = await createPaymentGateway(data);
        if (response?.data) {
          toast.success('Payment Gateway created successfully');
        }
      } else if (mode === 'edit' && paymentGatewayDetails?.id) {
        const response = await updatePaymentGateway({
          id: paymentGatewayDetails?.id,
          data,
        });
        if (response?.data) {
          toast.success('Payment Gateway updated successfully');
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong');
    }
  };

  const handleGatewayDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await deletePaymentGateway(selectedId);
      if (!response?.error) {
        toast.success('Payment Gateway deleted successfully');
        setActiveModal(null);
        setSelectedId(null);
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to delete payment gateway');
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader
            title="Payment Gateways"
            breadcrumb={[
              { label: 'Dashboard', path: `${route.adminDashboard}` },
              { label: 'Settings', path: '#' },
              { label: 'Financial', path: '#' },
              { label: 'Payment Gateways' },
            ]}
            addButtonLabel="Add Payment Gateway"
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
                    filters={gatewayFilters}
                    onApply={(filters) => {
                      const selected = filters['gateway'];
                      setSelectedGateway((selected?.value ?? '').toString());
                    }}
                    onReset={() => {
                      setSelectedGateway('');
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
        {/* Add Payment Gateway */}
        <DataModal
          show={activeModal === MODAL_TYPE.ADD}
          onClose={() => setActiveModal(null)}
          size="lg"
          modalTitle="Add Payment Gateway"
          body={
            <PaymentGatewayForm
              mode="add"
              onActiveModal={setActiveModal}
              onSubmit={async (data) => {
                await handleGatewayForm(data, 'add');
                setActiveModal(null);
              }}
            />
          }
        />

        {/* Edit Payment Gateway */}
        {paymentGatewayDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.EDIT}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Update Payment Gateway"
            body={
              <PaymentGatewayForm
                mode="edit"
                defaultValues={paymentGatewayDetails}
                onActiveModal={setActiveModal}
                onSubmit={async (data) => {
                  await handleGatewayForm(data, 'edit');
                  setActiveModal(null);
                }}
              />
            }
          />
        )}

        {/* View Payment Gateway */}
        {paymentGatewayDetails?.id && (
          <DataModal
            show={activeModal === MODAL_TYPE.VIEW}
            onClose={() => {
              setActiveModal(null);
              setSelectedId(null);
            }}
            size="lg"
            modalTitle="Payment Gateway Details"
            header={
              paymentGatewayDetails?.is_active ? (
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
            body={<PaymentGatewayDetailsView gatewayData={paymentGatewayDetails} />}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          show={activeModal === MODAL_TYPE.DELETE}
          onClose={() => {
            setActiveModal(null);
            setSelectedId(null);
          }}
          onConfirm={handleGatewayDelete}
          title="Delete Payment Gateway"
          message="Do you really want to delete this payment gateway? This action cannot be undone."
        />
      </>
    </div>
  );
};

export default PaymentGateways;
