import type { PaymentGatewayModel } from '../models/paymentGateway.model';

const PaymentGatewayDetailsView = ({ gatewayData }: { gatewayData: PaymentGatewayModel }) => {
  return (
    <div className="row">
      {/* Basic Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Gateway Name:</b>
              </p>
              <span className="text-capitalize">{gatewayData?.gateway_name}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Status:</b>
              </p>
              <span
                className={`badge ${
                  gatewayData?.is_active ? 'badge-soft-success' : 'badge-soft-danger'
                }`}
              >
                {gatewayData?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Store ID:</b>
              </p>
              <span>{gatewayData?.store_id || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Currency:</b>
              </p>
              <span>{gatewayData?.currency}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Mode:</b>
              </p>
              <span
                className={`badge ${
                  gatewayData?.sandbox_mode ? 'badge-soft-warning' : 'badge-soft-info'
                }`}
              >
                {gatewayData?.sandbox_mode ? 'Sandbox' : 'Live'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Organization:</b>
              </p>
              <span>{gatewayData?.organization_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Configuration</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Callback URL:</b>
              </p>
              <span className="text-break">{gatewayData?.callback_url || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-12">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Cancel URL:</b>
              </p>
              <span className="text-break">{gatewayData?.cancel_url || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Metadata</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Created At:</b>
              </p>
              <span>
                {gatewayData?.created_at
                  ? new Date(gatewayData.created_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="gateway-detail-info mb-3">
              <p>
                <b>Last Updated:</b>
              </p>
              <span>
                {gatewayData?.updated_at
                  ? new Date(gatewayData.updated_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayDetailsView;
