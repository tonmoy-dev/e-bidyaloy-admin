import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useDeleteSubmissionMutation,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);

  // Fetch submissions for this assignment
  const { data: submissions = [], isLoading } = useGetSubmissionsByAssignmentQuery(
    assignmentData?.id || '',
    { skip: !assignmentData?.id },
  );

  const [updateSubmission, { isLoading: isUpdating }] = useUpdateSubmissionMutation();
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteSubmissionMutation();

  // Get logged-in user info
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const gradedBy = user?.profile_id || user?.id;
  const gradedByName = user?.name || user?.username || 'Unknown';

  // Filter submissions based on search and selected student
  const filteredSubmissions = submissions.filter((submission) => {
    if (selectedStudentId) {
      return submission.student === selectedStudentId;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = submission.student_name?.toLowerCase().includes(query);
      const matchesId = submission.student_id?.toLowerCase().includes(query);
      return matchesName || matchesId;
    }
    return true;
  });

  // Get unique students for dropdown
  const studentsInDropdown = submissions.map((sub) => ({
    id: sub.student,
    name: sub.student_name || 'Unknown',
    studentId: sub.student_id || 'N/A',
  }));

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
          percentage: parseFloat(percentage.toFixed(2)),
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

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      await deleteSubmission(submissionId).unwrap();
      toast.success('Submission deleted successfully');
      setSubmissionToDelete(null);
    } catch (error) {
      console.error('Failed to delete submission:', error);
      toast.error('Failed to delete submission');
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

        .grade-modal-body {
          max-height: 70vh !important;
          min-height: 70vh !important;
          overflow-y: auto !important;
          display: flex;
          flex-direction: column;
        }

        .grade-modal-body .row:first-child {
          flex-shrink: 0;
        }

        .grade-modal-content {
          flex: 1;
          overflow-y: auto;
        }

        .grade-dropdown {
          max-height: 200px !important;
          overflow-y: auto !important;
          z-index: 1050 !important;
        }

        .delete-modal-overlay {
          display: block;
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2000;
        }
      `}</style>

      <div className="modal-body grade-modal-body">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : submissions.length > 0 ? (
          <div className="grade-modal-content">
            {/* Header Row with Assignment Info and Search Filter */}
            <div className="row mb-4">
              {/* Left: Assignment Details */}
              <div className="col-md-8">
                <div className="card border-0 bg-light">
                  <div className="card-body p-3">
                    <h5 className="mb-2">
                      <i className="fas fa-file-alt me-2 text-primary"></i>
                      {assignmentData?.title}
                    </h5>
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Instructions:</small>
                      <p className="mb-0 text-muted small">
                        {assignmentData?.instructions || 'No instructions provided'}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-primary">
                        <i className="fas fa-star me-1"></i>
                        Total Marks: {assignmentData?.total_marks}
                      </span>
                      <span className="badge bg-info">
                        <i className="fas fa-users me-1"></i>
                        {submissions.length} Submission{submissions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Search Filter Dropdown */}
              <div className="col-md-4">
                <div className="card border-0 bg-light">
                  <div className="card-body p-3">
                    <label className="form-label small fw-bold mb-2">
                      <i className="fas fa-filter me-2"></i>
                      Filter by Student
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      />
                      <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>

                      {/* Dropdown List */}
                      {showDropdown && studentsInDropdown.length > 0 && (
                        <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm grade-dropdown">
                          <div className="list-group list-group-flush">
                            <button
                              className={`list-group-item list-group-item-action small ${
                                !selectedStudentId ? 'active' : ''
                              }`}
                              onClick={() => {
                                setSelectedStudentId(null);
                                setSearchQuery('');
                              }}
                            >
                              <i className="fas fa-users me-2"></i>
                              All Students ({submissions.length})
                            </button>
                            {studentsInDropdown
                              .filter((student) => {
                                if (!searchQuery.trim()) return true;
                                const query = searchQuery.toLowerCase();
                                return (
                                  student.name.toLowerCase().includes(query) ||
                                  student.studentId.toLowerCase().includes(query)
                                );
                              })
                              .map((student) => (
                                <button
                                  key={student.id}
                                  className={`list-group-item list-group-item-action small ${
                                    selectedStudentId === student.id ? 'active' : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedStudentId(student.id);
                                    setSearchQuery(`${student.name} - ${student.studentId}`);
                                  }}
                                >
                                  <i className="fas fa-user me-2"></i>
                                  {student.name} -{' '}
                                  <span className="text-muted">{student.studentId}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedStudentId && (
                      <button
                        className="btn btn-sm btn-outline-secondary mt-2 w-100"
                        onClick={() => {
                          setSelectedStudentId(null);
                          setSearchQuery('');
                        }}
                      >
                        <i className="fas fa-times me-1"></i>
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Cards */}
            {filteredSubmissions.map((submission) => (
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
                      <button
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => setSubmissionToDelete(submission.id)}
                        title="Delete Submission"
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
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

            {/* No results after filtering */}
            {filteredSubmissions.length === 0 && (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                No submissions found matching your search criteria.
              </div>
            )}
          </div>
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

      {/* Delete Confirmation Modal */}
      {submissionToDelete && (
        <div className="delete-modal-overlay" onClick={() => setSubmissionToDelete(null)}>
          <div className="modal fade show d-block" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-exclamation-triangle me-2 text-danger"></i>
                    Confirm Deletion
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSubmissionToDelete(null)}
                    title="Close modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2">
                    <strong>Are you sure you want to delete this submission?</strong>
                  </p>
                  <p className="text-muted small">
                    This action cannot be undone. The submission and all its attachments will be
                    permanently deleted.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSubmissionToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteSubmission(submissionToDelete)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash me-1"></i>
                        Delete Submission
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GradeSubmissionsModal;
