// components/NoticeDetailsView.tsx

import type { NoticeModel } from '../models/notice.model';

const NoticeDetailsView = ({ noticeData }: { noticeData: NoticeModel }) => {
  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      students: 'Students',
      teachers: 'Teachers',
      parents: 'Parents',
      all: 'All',
    };
    return labels[audience] || audience;
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
      {/* Basic Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Title:</b>
              </p>
              <span className="fs-5">{noticeData?.title}</span>
            </div>
          </div>

          <div className="col-md-12">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Description:</b>
              </p>
              <span className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                {noticeData?.description}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Audience:</b>
              </p>
              <span className="badge badge-soft-primary">
                {getAudienceLabel(noticeData?.audience)}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Status:</b>
              </p>
              <span
                className={`badge ${
                  noticeData?.is_published ? 'badge-soft-success' : 'badge-soft-warning'
                }`}
              >
                {noticeData?.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Organization:</b>
              </p>
              <span>{noticeData?.organization_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Created By:</b>
              </p>
              <span>{noticeData?.created_by_name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Date Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Publish Date:</b>
              </p>
              <span>
                {noticeData?.publish_date
                  ? new Date(noticeData.publish_date).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Expiry Date:</b>
              </p>
              <span>
                {noticeData?.expiry_date ? (
                  <>
                    {new Date(noticeData.expiry_date).toLocaleDateString()}
                    {new Date(noticeData.expiry_date) < new Date() && (
                      <span className="badge badge-soft-danger ms-2">Expired</span>
                    )}
                  </>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment */}
      {noticeData?.attachment && (
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Attachment</h5>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {isImageFile(noticeData.attachment) ? (
                    <div className="text-center">
                      <img
                        src={noticeData.attachment}
                        alt="Notice attachment"
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                      <div className="mt-3">
                        <a
                          href={noticeData.attachment}
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
                          <i className={`${getFileIcon(noticeData.attachment)} fs-1`} />
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold">
                            {noticeData.attachment.split('/').pop()}
                          </p>
                          <small className="text-muted">Document file</small>
                        </div>
                      </div>
                      <a
                        href={noticeData.attachment}
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
            <div className="notice-detail-info mb-3">
              <p>
                <b>Created At:</b>
              </p>
              <span>
                {noticeData?.created_at
                  ? new Date(noticeData.created_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="notice-detail-info mb-3">
              <p>
                <b>Last Updated:</b>
              </p>
              <span>
                {noticeData?.updated_at
                  ? new Date(noticeData.updated_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailsView;