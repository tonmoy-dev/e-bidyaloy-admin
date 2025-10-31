import type { AssignedStudent, AssignmentModel } from '../models/assignment.model';

const AssignmentDetailsView = ({ assignmentData }: { assignmentData: AssignmentModel }) => {
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
        {/* Basic Information */}
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Assignment Title:</b>
                </p>
                <span>{assignmentData?.title}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Status:</b>
                </p>
                <span
                  className={`badge ${
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

            <div className="col-md-6">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Description:</b>
                </p>
                <span>{assignmentData?.description || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Instructions:</b>
                </p>
                <span>{assignmentData?.instructions || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Assignment Details</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Target Type:</b>
                </p>
                <span className="text-capitalize">{assignmentData?.target_type}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Total Marks:</b>
                </p>
                <span>{assignmentData?.total_marks}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Due Date:</b>
                </p>
                <span>
                  {assignmentData?.due_date
                    ? new Date(assignmentData.due_date).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="col-md-12 mb-4">
          <h5 className="border-bottom pb-2 mb-3">Academic Information</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Class:</b>
                </p>
                <span>{assignmentData?.class_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Section:</b>
                </p>
                <span>{assignmentData?.section_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Subject:</b>
                </p>
                <span>{assignmentData?.subject_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Assigned By:</b>
                </p>
                <span>{assignmentData?.assigned_by_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="assignment-detail-info mb-3">
                <p>
                  <b>Academic Year:</b>
                </p>
                <span>{assignmentData?.academic_year_name || 'N/A'}</span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="assignment-detail-info">
                <p>
                  <b>Created At:</b>
                </p>
                <span>
                  {assignmentData?.created_at
                    ? new Date(assignmentData.created_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {assignmentData?.assigned_date && (
              <div className="col-md-6">
                <div className="assignment-detail-info">
                  <p>
                    <b>Assigned Date:</b>
                  </p>
                  <span>{new Date(assignmentData.assigned_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
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

        {/* Submission Statistics */}
        {assignmentData?.submission_stats && (
          <div className="col-md-12 mb-4">
            <h5 className="border-bottom pb-2 mb-3">Submission Statistics</h5>
            <div className="row">
              <div className="col-md-3">
                <div className="text-center p-3 bg-light rounded">
                  <h4 className="text-primary mb-1">{assignmentData.submission_stats.total}</h4>
                  <small className="text-muted">Total Students</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                  <h4 className="text-success mb-1">{assignmentData.submission_stats.submitted}</h4>
                  <small className="text-muted">Submitted</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                  <h4 className="text-info mb-1">{assignmentData.submission_stats.graded}</h4>
                  <small className="text-muted">Graded</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                  <h4 className="text-warning mb-1">{assignmentData.submission_stats.pending}</h4>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Students - Only show for individual target type */}
        {assignmentData?.target_type === 'individual' && (
          <div className="col-md-12 mb-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 className="mb-0">Assigned Students</h5>
              {assignmentData?.assigned_students && assignmentData.assigned_students.length > 0 && (
                <span className="badge bg-primary">
                  {assignmentData.assigned_students.length} Students
                </span>
              )}
            </div>
            {assignmentData?.assigned_students && assignmentData.assigned_students.length > 0 ? (
              <div className="row">
                {assignmentData.assigned_students.map(
                  (assignedStudent: AssignedStudent, index: number) => (
                    <div key={assignedStudent.id} className="col-md-4 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                              <div className="avatar avatar-sm">
                                <span className="avatar-title bg-primary text-white rounded-circle fw-bold">
                                  {assignedStudent.student_name?.split(' ')[0]?.charAt(0)}
                                  {assignedStudent.student_name?.split(' ')[1]?.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1 text-truncate">{assignedStudent.student_name}</h6>
                              <div className="text-muted small">
                                <div>
                                  Student ID:{' '}
                                  <span className="fw-medium">{assignedStudent.student_id}</span>
                                </div>
                                <div>
                                  Assigned:{' '}
                                  <span className="fw-medium">
                                    {new Date(assignedStudent.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="badge bg-light text-dark">{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                No students assigned to this assignment.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AssignmentDetailsView;
