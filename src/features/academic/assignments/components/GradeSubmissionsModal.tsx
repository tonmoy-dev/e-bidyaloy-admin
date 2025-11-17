import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetSubmissionsByAssignmentQuery,
  useUpdateSubmissionMutation,
} from '../api/submissionApi';
import type { AssignmentModel } from '../models/assignment.model';

interface GradeSubmissionsModalProps {
  assignmentData: AssignmentModel;
  onClose: () => void;
}

const GradeSubmissionsModal = ({ assignmentData, onClose }: GradeSubmissionsModalProps) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [marksObtained, setMarksObtained] = useState('');
  const [feedback, setFeedback] = useState('');
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  // Fetch submissions for this assignment
  const { data: submissions = [], isLoading } = useGetSubmissionsByAssignmentQuery(
    assignmentData?.id || '',
    { skip: !assignmentData?.id },
  );

  const [updateSubmission, { isLoading: isUpdating }] = useUpdateSubmissionMutation();

  // Get logged-in user info
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const gradedBy = user?.profile_id || user?.id;
  const gradedByName = user?.name || user?.username || 'Unknown';

  const handleGradeSubmission = async (submissionId: string) => {
    if (!marksObtained) {
      toast.error('Please enter marks obtained');
      return;
    }

    const marks = parseFloat(marksObtained);
    const totalMarks = parseFloat(assignmentData?.total_marks?.toString() || '0');

    if (marks > totalMarks) {
      toast.error(`Marks cannot exceed total marks (${totalMarks})`);
      return;
    }

    try {
      const percentage = totalMarks > 0 ? (marks / totalMarks) * 100 : 0;

      await updateSubmission({
        id: submissionId,
        data: {
          marks_obtained: marksObtained,
          feedback: feedback || null,
          graded_by: gradedBy,
          graded_by_name: gradedByName,
          graded_at: new Date().toISOString(),
          status: 'graded',
          percentage: percentage.toFixed(2),
        },
      }).unwrap();

      toast.success('Submission graded successfully');

      // Reset form
      setSelectedSubmissionId(null);
      setMarksObtained('');
      setFeedback('');
    } catch (error) {
      console.error('Failed to grade submission:', error);
      toast.error('Failed to grade submission');
    }
  };

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <style>{`
        .submission-card {
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        
        .submission-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-left-color: #0d6efd;
        }
        
        .submission-card.graded {
          border-left-color: #198754;
        }
        
        .attachment-card {
          transition: all 0.2s ease;
        }
        
        .attachment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .attachment-icon-wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 0.375rem;
        }
      `}</style>

      <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : submissions.length > 0 ? (
          <>
            <div className="mb-3">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Assignment:</strong> {assignmentData?.title} |
                <strong className="ms-2">Total Marks:</strong> {assignmentData?.total_marks}
              </div>
            </div>

            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`card mb-3 submission-card ${
                  submission.status === 'graded' ? 'graded' : ''
                }`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">
                        <i className="fas fa-user me-2"></i>
                        {submission.student_name || 'Unknown Student'}
                      </h6>
                      {submission.student_id && (
                        <small className="text-muted">ID: {submission.student_id}</small>
                      )}
                    </div>
                    <div className="text-end">
                      <span
                        className={`badge ${
                          submission.status === 'graded'
                            ? 'bg-success'
                            : submission.status === 'late'
                            ? 'bg-warning'
                            : 'bg-info'
                        }`}
                      >
                        {submission.status}
                      </span>
                      {submission.is_late && (
                        <small className="d-block text-danger mt-1">
                          <i className="fas fa-clock me-1"></i>
                          Late Submission
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Submitted Date & Time</small>
                      <strong>
                        {submission.submitted_at
                          ? new Date(submission.submitted_at).toLocaleString()
                          : 'N/A'}
                      </strong>
                    </div>
                    {submission.marks_obtained !== null && (
                      <div className="col-md-6">
                        <small className="text-muted d-block">Current Grade</small>
                        <strong className="text-primary">
                          {submission.marks_obtained} / {assignmentData?.total_marks}
                          {submission.percentage !== null && (
                            <span className="ms-2 text-muted">({submission.percentage}%)</span>
                          )}
                        </strong>
                      </div>
                    )}
                  </div>

                  {submission.submission_text && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Submission Message</small>
                      <p className="mb-0 bg-light p-2 rounded">{submission.submission_text}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  {submission.attachments && submission.attachments.length > 0 && (
                    <div className="mb-3">
                      <button
                        className="btn btn-sm btn-outline-secondary mb-2"
                        onClick={() =>
                          setExpandedSubmissionId(
                            expandedSubmissionId === submission.id ? null : submission.id,
                          )
                        }
                      >
                        <i
                          className={`fas fa-chevron-${
                            expandedSubmissionId === submission.id ? 'up' : 'down'
                          } me-2`}
                        ></i>
                        {expandedSubmissionId === submission.id ? 'Hide' : 'Show'} Attachments (
                        {submission.attachments.length})
                      </button>

                      {expandedSubmissionId === submission.id && (
                        <div className="row g-2">
                          {submission.attachments.map((attachment) => (
                            <div key={attachment.id} className="col-md-6">
                              <div className="card border-0 shadow-sm attachment-card">
                                <div className="card-body p-2">
                                  <div className="d-flex align-items-center">
                                    <div className="attachment-icon-wrapper me-2">
                                      <i className={getFileIcon(attachment.file_name)}></i>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                      <h6
                                        className="mb-0 text-truncate small"
                                        title={attachment.file_name}
                                      >
                                        {attachment.file_name}
                                      </h6>
                                      <small className="text-muted">
                                        {formatFileSize(attachment.file_size)}
                                      </small>
                                    </div>
                                    <div className="d-flex gap-1">
                                      {attachment.file && (
                                        <>
                                          <a
                                            href={attachment.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-xs btn-outline-primary"
                                            title="View"
                                          >
                                            <i className="fas fa-eye"></i>
                                          </a>
                                          <a
                                            href={attachment.file}
                                            download={attachment.file_name}
                                            className="btn btn-xs btn-outline-secondary"
                                            title="Download"
                                          >
                                            <i className="fas fa-download"></i>
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grading Form */}
                  {selectedSubmissionId === submission.id ? (
                    <div className="border-top pt-3">
                      <h6 className="mb-3">
                        <i className="fas fa-edit me-2"></i>
                        Grade Submission
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Marks Obtained <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={`Enter marks (Max: ${assignmentData?.total_marks})`}
                            value={marksObtained}
                            onChange={(e) => setMarksObtained(e.target.value)}
                            min="0"
                            max={assignmentData?.total_marks}
                            step="0.5"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Feedback</label>
                          <textarea
                            className="form-control"
                            placeholder="Enter feedback for the student..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="col-md-12">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleGradeSubmission(submission.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                  ></span>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-save me-2"></i>
                                  Save Grade
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                setSelectedSubmissionId(null);
                                setMarksObtained('');
                                setFeedback('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedSubmissionId(submission.id);
                          setMarksObtained(submission.marks_obtained?.toString() || '');
                          setFeedback(submission.feedback || '');
                        }}
                      >
                        <i className="fas fa-edit me-2"></i>
                        {submission.marks_obtained !== null ? 'Update Grade' : 'Grade Submission'}
                      </button>
                    </div>
                  )}

                  {/* Existing Grade Info */}
                  {submission.marks_obtained !== null && submission.graded_by_name && (
                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">
                        <i className="fas fa-user-check me-2"></i>
                        Graded by <strong>{submission.graded_by_name}</strong>
                        {submission.graded_at &&
                          ` on ${new Date(submission.graded_at).toLocaleString()}`}
                      </small>
                      {submission.feedback && (
                        <div className="mt-2">
                          <small className="text-muted d-block mb-1">Feedback:</small>
                          <p className="mb-0 bg-light p-2 rounded small">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            No submissions yet for this assignment.
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default GradeSubmissionsModal;
