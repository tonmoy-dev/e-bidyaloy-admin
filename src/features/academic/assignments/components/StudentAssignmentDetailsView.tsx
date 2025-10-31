import type { AssignmentModel } from '../models/assignment.model';

const StudentAssignmentDetailsView = ({ assignmentData }: { assignmentData: AssignmentModel }) => {
  // Get attachments directly from assignment data
  const attachments = assignmentData?.attachments || [];

  return (
    <>
      <style>{`
        .attachment-card {
          transition: all 0.2s ease;
        }
        
        .attachment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        }
        
        .attachment-icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 0.375rem;
        }
        
        .attachment-icon-wrapper i {
          font-size: 1.5rem !important;
        }
        
        .btn-outline-primary:hover {
          transform: none;
        }
        
        .btn-outline-secondary:hover {
          transform: none;
        }

        /* Assignment detail compact view */
        .assignment-header h4 { font-weight: 600; }
        .assignment-meta { line-height: 1.4; }
        .assignment-meta .meta-label { font-size: 0.95rem; }
        .assignment-description { white-space: pre-wrap; }

        /* Polished header + meta design */
        .assignment-card { border-radius: 10px; }
        .assignment-title .title-icon {
          width: 40px;
          height: 40px;
          background: #eef2ff; /* soft indigo */
          color: #4f46e5;
          font-size: 1rem;
        }
        .marks-pill {
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 600;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.9rem;
        }
        .status-badge { text-transform: capitalize; }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        .meta-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 12px;
          background: #f8f9fa;
          border: 1px solid #eceff3;
          border-radius: 8px;
        }
        .meta-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          font-size: 0.95rem;
          border: 1px solid #eef2f7;
        }
        .meta-text .label { font-size: 0.8rem; color: #6b7280; }
        .meta-text .value { font-weight: 600; color: #111827; }
        .description-box {
          background: #fbfbfd;
          border: 1px solid #eceff3;
          border-radius: 8px;
          padding: 12px;
        }

        /* Attachments responsive grid - responsive to container width (not viewport) */
        .attachments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .attachments-grid-item { /* placeholder if we want per-item tweaks later */ }

        /* Mobile modal fixes */
        @media (max-width: 768px) {
          .modal-dialog {
            margin: 0.5rem !important;
            max-width: calc(100% - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
          }
          
          .modal-content {
            max-height: calc(100vh - 1rem) !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 1rem !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .modal-header {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
            border-bottom: 1px solid #dee2e6 !important;
          }
          
          .modal-footer {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
            border-top: 1px solid #dee2e6 !important;
            background-color: #f8f9fa !important;
          }

          .assignment-detail-info {
            margin-bottom: 1rem !important;
          }

          .assignment-detail-info p {
            margin-bottom: 0.25rem !important;
            font-size: 0.9rem !important;
          }

          .assignment-detail-info span {
            font-size: 0.9rem !important;
          }

          .card-body {
            padding: 0.75rem !important;
          }

          .attachment-card {
            margin-bottom: 0.75rem !important;
          }

          /* Single column layout for tablets */
          .attachments-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          /* Full width for attachment items on tablets */
          .attachments-grid-item {
            grid-column: 1 / -1;
          }
        }

        /* Additional mobile optimizations */
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0 !important;
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
          
          .modal-content {
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
          
          .modal-body {
            padding: 0.75rem !important;
          }
          
          .modal-header .modal-title {
            font-size: 1.1rem !important;
          }

          .row {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .col-md-3, .col-md-4, .col-md-6, .col-md-12 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }

          h5 {
            font-size: 1rem !important;
            margin-bottom: 0.75rem !important;
          }

          .border-bottom {
            padding-bottom: 0.5rem !important;
            margin-bottom: 0.75rem !important;
          }

          .btn-sm {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.8rem !important;
          }

          .attachment-icon-wrapper {
            width: 40px !important;
            height: 40px !important;
          }

          .attachment-icon-wrapper i {
            font-size: 1.2rem !important;
          }

          /* Extra-small: allow smaller cards to avoid overlap in narrow modals */
          .attachments-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          /* Ensure full width on extra small screens */
          .attachments-grid-item {
            grid-column: 1 / -1;
          }
        }

        /* Ensure modal backdrop doesn't interfere with scrolling */
        body .modal-open {
          overflow: hidden !important;
        }

        /* Global modal fixes that apply to any modal on the page */
        @media (max-width: 768px) {
          body .modal-dialog {
            margin: 0.5rem !important;
            max-width: calc(100vw - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
          }
          
          body .modal-content {
            max-height: calc(100vh - 1rem) !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
          }
          
          body .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 1rem !important;
          }
          
          body .modal-header {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
          }
          
          body .modal-footer {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
          }
        }

        @media (max-width: 576px) {
          body .modal-dialog {
            margin: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
          
          body .modal-content {
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
          }
          
          body .modal-body {
            padding: 0.75rem !important;
          }
          
          body .modal-header {
            padding: 0.75rem !important;
            border-bottom: 1px solid #dee2e6 !important;
          }
          
          body .modal-footer {
            padding: 0.75rem !important;
            border-top: 1px solid #dee2e6 !important;
          }
        }
      `}</style>
      <div className="row">
        {/* Assignment Header + Meta (polished card) - Student View */}
        <div className="col-md-12 mb-4">
          <div className="card assignment-card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 assignment-title">
                <div className="d-flex align-items-center gap-2">
                  <span className="title-icon rounded-circle d-inline-flex align-items-center justify-content-center">
                    <i className="fas fa-book-open" />
                  </span>
                  <h4 className="mb-0">{assignmentData?.title}</h4>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="marks-pill">Total Marks: {assignmentData?.total_marks}</span>
                  <span
                    className={`badge status-badge ${
                      assignmentData?.status === 'published'
                        ? 'badge-soft-success'
                        : assignmentData?.status === 'draft'
                        ? 'badge-soft-warning'
                        : 'badge-soft-danger'
                    }`}
                  >
                    {assignmentData?.status}
                  </span>
                </div>
              </div>

              <div className="meta-grid mt-3">
                <div className="meta-item">
                  <span className="meta-icon">
                    <i className="fas fa-book"></i>
                  </span>
                  <div className="meta-text">
                    <div className="label">Subject</div>
                    <div className="value">{assignmentData?.subject_name || 'N/A'}</div>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">
                    <i className="fas fa-chalkboard"></i>
                  </span>
                  <div className="meta-text">
                    <div className="label">Class. Section.</div>
                    <div className="value">
                      {assignmentData?.class_name || 'N/A'}
                      {assignmentData?.section_name ? (
                        <>
                          {' '}
                          {'. '} {assignmentData.section_name}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">
                    <i className="fas fa-calendar-plus"></i>
                  </span>
                  <div className="meta-text">
                    <div className="label">Created Date</div>
                    <div className="value">
                      {assignmentData?.created_at
                        ? new Date(assignmentData.created_at).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">
                    <i className="fas fa-calendar-check"></i>
                  </span>
                  <div className="meta-text">
                    <div className="label">Due Date</div>
                    <div className="value">
                      {assignmentData?.due_date
                        ? new Date(assignmentData.due_date).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="description-box mt-3">
                <h6 className="text-muted mb-2">Student's Instructions</h6>
                <p className="mb-0 assignment-description text-body">
                  {assignmentData?.instructions || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {attachments && attachments.length > 0 ? (
          <div className="col-md-12 mb-4">
            <h5 className="border-bottom pb-2 mb-3">
              <i className="fas fa-paperclip me-2"></i>
              Assignment Files ({attachments.length})
            </h5>
            <div className="attachments-grid">
              {attachments.map((attachment, index) => {
                // Get file icon based on extension
                const getFileIcon = (fileName: string): string => {
                  const extension = fileName.split('.').pop()?.toLowerCase();
                  switch (extension) {
                    case 'pdf':
                      return 'fas fa-file-pdf text-danger';
                    case 'doc':
                    case 'docx':
                      return 'fas fa-file-word text-primary';
                    case 'txt':
                      return 'fas fa-file-alt text-secondary';
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                      return 'fas fa-file-image text-success';
                    default:
                      return 'fas fa-file text-secondary';
                  }
                };

                // Format file size
                const formatFileSize = (bytes: number): string => {
                  if (bytes === 0) return '0 Bytes';
                  const k = 1024;
                  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                  const i = Math.floor(Math.log(bytes) / Math.log(k));
                  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                };

                return (
                  <div key={attachment.id} className="attachments-grid-item">
                    <div className="card border-0 shadow-sm h-100 attachment-card">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <div className="attachment-icon-wrapper">
                              <i className={`${getFileIcon(attachment.file_name)} fa-2x`}></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-truncate" title={attachment.file_name}>
                              {attachment.file_name}
                            </h6>
                            <div className="text-muted small mb-2">
                              <div>Size: {formatFileSize(attachment.file_size)}</div>
                              <div>
                                Uploaded:{' '}
                                {attachment.created_at
                                  ? new Date(attachment.created_at).toLocaleDateString()
                                  : 'N/A'}
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              {attachment.file && (
                                <a
                                  href={attachment.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                  title="View file"
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  View
                                </a>
                              )}
                              {attachment.file && (
                                <a
                                  href={attachment.file}
                                  download={attachment.file_name}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Download file"
                                >
                                  <i className="fas fa-download me-1"></i>
                                  Download
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="badge bg-light text-dark">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default StudentAssignmentDetailsView;
