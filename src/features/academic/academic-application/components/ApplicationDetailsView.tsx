import type { ApplicationModel } from '../models/application.model';

const ApplicationDetailsView = ({ applicationData }: { applicationData: ApplicationModel }) => {
  const getApplicationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: 'Leave Application',
      request: 'General Request',
      other: 'Other Application',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { class: string; label: string }> = {
      pending: { class: 'badge-soft-warning', label: 'Pending' },
      approved: { class: 'badge-soft-success', label: 'Approved' },
      rejected: { class: 'badge-soft-danger', label: 'Rejected' },
      cancelled: { class: 'badge-soft-secondary', label: 'Cancelled' },
    };

    const config = statusConfig[status || 'pending'];
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'ti-file-type-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'ti-file-type-doc text-primary';
      case 'xls':
      case 'xlsx':
        return 'ti-file-type-xls text-success';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'ti-photo text-info';
      default:
        return 'ti-file text-secondary';
    }
  };

  const isImageFile = (filename: string) => {
    return filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  return (
    <div className="row">
      {/* Application Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Application Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="application-detail-info mb-3">
              <p>
                <b>Application Type:</b>
              </p>
              <span className="badge badge-soft-primary">
                {getApplicationTypeLabel(applicationData?.application_type)}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="application-detail-info mb-3">
              <p>
                <b>Status:</b>
              </p>
              {getStatusBadge(applicationData?.status)}
            </div>
          </div>

          <div className="col-md-12">
            <div className="application-detail-info mb-3">
              <p>
                <b>Subject:</b>
              </p>
              <span className="fs-5">{applicationData?.subject}</span>
            </div>
          </div>

          <div className="col-md-12">
            <div className="application-detail-info mb-3">
              <p>
                <b>Message:</b>
              </p>
              <span className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                {applicationData?.message}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Information */}
      {(applicationData?.status === 'approved' || applicationData?.status === 'rejected') && (
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Review Information</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="application-detail-info mb-3">
                <p>
                  <b>Reviewed By:</b>
                </p>
                <span>{applicationData?.reviewed_by_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="application-detail-info mb-3">
                <p>
                  <b>Reviewed At:</b>
                </p>
                <span>
                  {applicationData?.reviewed_at
                    ? new Date(applicationData.reviewed_at).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {applicationData?.response_message && (
              <div className="col-md-12">
                <div className="application-detail-info mb-3">
                  <p>
                    <b>Response Message:</b>
                  </p>
                  <span className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {applicationData.response_message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachment */}
      {applicationData?.attachment && (
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Attachment</h5>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {isImageFile(applicationData.attachment) ? (
                    <div className="text-center">
                      <img
                        src={applicationData.attachment}
                        alt="Application attachment"
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                      <div className="mt-3">
                        <a
                          href={applicationData.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          <i className="ti ti-download me-1" />
                          Download Image
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className={`${getFileIcon(applicationData.attachment)} fs-1`} />
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold">
                            {applicationData.attachment.split('/').pop()}
                          </p>
                          <small className="text-muted">Document file</small>
                        </div>
                      </div>
                      <a
                        href={applicationData.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="ti ti-download me-1" />
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Metadata</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="application-detail-info mb-3">
              <p>
                <b>Created At:</b>
              </p>
              <span>
                {applicationData?.created_at
                  ? new Date(applicationData.created_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="application-detail-info mb-3">
              <p>
                <b>Last Updated:</b>
              </p>
              <span>
                {applicationData?.updated_at
                  ? new Date(applicationData.updated_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="application-detail-info mb-3">
              <p>
                <b>Organization:</b>
              </p>
              <span>{applicationData?.organization_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsView;
