import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetSubmissionsByAssignmentQuery } from '../api/submissionApi';
import type { AssignmentModel } from '../models/assignment.model';

interface GradeSubmissionsModalProps {
  assignmentData: AssignmentModel;
}

const GradeSubmissionsModal = ({ assignmentData }: GradeSubmissionsModalProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  // Fetch submissions for this assignment
  const { data: submissions, isLoading } = useGetSubmissionsByAssignmentQuery(
    assignmentData?.id || '',
    {
      skip: !assignmentData?.id,
    },
  );

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
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

  // Get submission attachments
  const getSubmissionAttachments = (submissionId: string) => {
    return (
      assignmentData?.attachments?.filter(
        (att) => att.attachment_type === 'submission' && att.submission === submissionId,
      ) || []
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : submissions && submissions.length > 0 ? (
        <div className="row">
          {submissions.map((submission) => {
            const submissionAttachments = getSubmissionAttachments(submission.id);

            return (
              <div key={submission.id} className="col-md-12 mb-4">
                <div
                  className={`card border ${
                    selectedSubmission === submission.id ? 'border-primary shadow' : 'border-light'
                  }`}
                >
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="avatar avatar-md">
                            <span className="avatar-title bg-primary text-white rounded-circle fw-bold">
                              {submission.student_name?.charAt(0) || 'S'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{submission.student_name || 'Unknown Student'}</h6>
                          <div className="text-muted small">
                            <span className="me-3">
                              <i className="fas fa-id-card me-1"></i>
                              Student ID: {submission.student_id || 'N/A'}
                            </span>
                            <span className="me-3">
                              <i className="fas fa-chalkboard-teacher me-1"></i>
                              Class: {submission.class_name || 'N/A'}
                            </span>
                            <span>
                              <i className="fas fa-users me-1"></i>
                              Section: {submission.section_name || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            submission.status === 'graded'
                              ? 'badge-soft-success'
                              : submission.status === 'submitted'
                              ? 'badge-soft-info'
                              : 'badge-soft-warning'
                          }`}
                        >
                          <i
                            className={`fas ${
                              submission.status === 'graded'
                                ? 'fa-check-circle'
                                : submission.status === 'submitted'
                                ? 'fa-paper-plane'
                                : 'fa-clock'
                            } me-1`}
                          ></i>
                          {submission.status}
                        </span>
                        {submission.marks_obtained !== null &&
                          submission.marks_obtained !== undefined && (
                            <span className="badge bg-primary">
                              {submission.marks_obtained} / {assignmentData?.total_marks}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {/* Submission Details */}
                      <div className="col-md-6 mb-3">
                        <h6 className="text-muted mb-2">
                          <i className="fas fa-info-circle me-2"></i>
                          Submission Details
                        </h6>
                        <div className="bg-light p-3 rounded">
                          <div className="mb-2">
                            <small className="text-muted">Submitted At:</small>
                            <div className="fw-medium">
                              {submission.submitted_at
                                ? new Date(submission.submitted_at).toLocaleString()
                                : 'N/A'}
                            </div>
                          </div>
                          {submission.graded_at && (
                            <div className="mb-2">
                              <small className="text-muted">Graded At:</small>
                              <div className="fw-medium">
                                {new Date(submission.graded_at).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submission Message */}
                      {submission.submission_text && (
                        <div className="col-md-6 mb-3">
                          <h6 className="text-muted mb-2">
                            <i className="fas fa-comment me-2"></i>
                            Student's Message
                          </h6>
                          <div className="bg-light p-3 rounded">
                            <p className="mb-0 submission-text">{submission.submission_text}</p>
                          </div>
                        </div>
                      )}

                      {/* Teacher Feedback */}
                      {submission.feedback && (
                        <div className="col-md-12 mb-3">
                          <h6 className="text-muted mb-2">
                            <i className="fas fa-comments me-2"></i>
                            Your Feedback
                          </h6>
                          <div className="bg-success bg-opacity-10 border border-success p-3 rounded">
                            <p className="mb-0 submission-text">{submission.feedback}</p>
                          </div>
                        </div>
                      )}

                      {/* Submitted Files */}
                      {submissionAttachments.length > 0 && (
                        <div className="col-md-12">
                          <h6 className="text-muted mb-2">
                            <i className="fas fa-paperclip me-2"></i>
                            Submitted Files ({submissionAttachments.length})
                          </h6>
                          <div className="row">
                            {submissionAttachments.map((attachment) => (
                              <div key={attachment.id} className="col-md-6 mb-2">
                                <div className="card border-0 bg-light">
                                  <div className="card-body p-2">
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        <i
                                          className={`${getFileIcon(attachment.file_name)} fs-4`}
                                        ></i>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div
                                          className="small text-truncate"
                                          title={attachment.file_name}
                                        >
                                          {attachment.file_name}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                          {formatFileSize(attachment.file_size)}
                                        </div>
                                      </div>
                                      <div className="d-flex gap-1">
                                        {attachment.file && (
                                          <a
                                            href={attachment.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                            title="View"
                                          >
                                            <i className="fas fa-eye"></i>
                                          </a>
                                        )}
                                        {attachment.file && (
                                          <a
                                            href={attachment.file}
                                            download={attachment.file_name}
                                            className="btn btn-sm btn-outline-secondary"
                                            title="Download"
                                          >
                                            <i className="fas fa-download"></i>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Grade Button */}
                    <div className="mt-3 text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedSubmission(submission.id);
                          toast.info('Grading feature coming soon!');
                        }}
                      >
                        <i className="fas fa-edit me-2"></i>
                        {submission.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No submissions found for this assignment yet.
        </div>
      )}

      <style>{`
        .submission-text {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default GradeSubmissionsModal;
