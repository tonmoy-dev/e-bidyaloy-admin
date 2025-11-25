import type { ComplaintModel } from '../models/complaint.model';

const ComplaintDetailsView = ({ complaintData }: { complaintData: ComplaintModel }) => {
  const getComplaintTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      academic: 'Academic Issue',
      facility: 'Facility Issue',
      behavior: 'Behavioral Issue',
      transport: 'Transport Issue',
      administrative: 'Administrative Issue',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { class: string; label: string }> = {
      pending: { class: 'badge-soft-warning', label: 'Pending' },
      in_progress: { class: 'badge-soft-info', label: 'In Progress' },
      resolved: { class: 'badge-soft-success', label: 'Resolved' },
      closed: { class: 'badge-soft-secondary', label: 'Closed' },
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
      {/* Complaint Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Complaint Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Complaint Type:</b>
              </p>
              <span className="badge badge-soft-primary">
                {getComplaintTypeLabel(complaintData?.complaint_type)}
              </span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Status:</b>
              </p>
              {getStatusBadge(complaintData?.status)}
            </div>
          </div>

          <div className="col-md-12">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Subject:</b>
              </p>
              <span className="fs-5">{complaintData?.subject}</span>
            </div>
          </div>

          <div className="col-md-12">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Description:</b>
              </p>
              <span className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                {complaintData?.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complainant Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Complainant Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Name:</b>
              </p>
              <span>{complaintData?.complainant_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Email:</b>
              </p>
              <span>{complaintData?.complainant_email || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Information */}
      {complaintData?.status === 'resolved' && (
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Resolution Information</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="complaint-detail-info mb-3">
                <p>
                  <b>Resolved By:</b>
                </p>
                <span>{complaintData?.resolved_by_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="complaint-detail-info mb-3">
                <p>
                  <b>Resolved At:</b>
                </p>
                <span>
                  {complaintData?.resolved_at
                    ? new Date(complaintData.resolved_at).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {complaintData?.response_message && (
              <div className="col-md-12">
                <div className="complaint-detail-info mb-3">
                  <p>
                    <b>Response Message:</b>
                  </p>
                  <span className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {complaintData.response_message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachment */}
      {complaintData?.attachment && (
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Attachment</h5>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {isImageFile(complaintData.attachment) ? (
                    <div className="text-center">
                      <img
                        src={complaintData.attachment}
                        alt="Complaint attachment"
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                      <div className="mt-3">
                        <a
                          href={complaintData.attachment}
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
                          <i className={`${getFileIcon(complaintData.attachment)} fs-1`} />
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold">
                            {complaintData.attachment.split('/').pop()}
                          </p>
                          <small className="text-muted">Document file</small>
                        </div>
                      </div>
                      <a
                        href={complaintData.attachment}
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
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Created At:</b>
              </p>
              <span>
                {complaintData?.created_at
                  ? new Date(complaintData.created_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Last Updated:</b>
              </p>
              <span>
                {complaintData?.updated_at
                  ? new Date(complaintData.updated_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="complaint-detail-info mb-3">
              <p>
                <b>Organization:</b>
              </p>
              <span>{complaintData?.organization_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsView;
