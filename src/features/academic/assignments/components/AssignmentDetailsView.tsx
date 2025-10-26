import type { AssignmentModel, AssignedStudent } from '../models/assignment.model';

const AssignmentDetailsView = ({ assignmentData }: { assignmentData: AssignmentModel }) => {

  return (
    <div className="row">
      {/* Basic Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="assignment-detail-info mb-3">
              <p><b>Assignment Title:</b></p>
              <span>{assignmentData?.title}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="assignment-detail-info mb-3">
              <p><b>Status:</b></p>
              <span className={`badge ${
                assignmentData?.status === 'published' ? 'badge-soft-success' :
                assignmentData?.status === 'draft' ? 'badge-soft-warning' :
                'badge-soft-danger'
              }`}>
                {assignmentData?.status}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="assignment-detail-info mb-3">
              <p><b>Description:</b></p>
              <span>{assignmentData?.description || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="assignment-detail-info mb-3">
              <p><b>Instructions:</b></p>
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
              <p><b>Target Type:</b></p>
              <span className="text-capitalize">{assignmentData?.target_type}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Total Marks:</b></p>
              <span>{assignmentData?.total_marks}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Due Date:</b></p>
              <span>{assignmentData?.due_date ? new Date(assignmentData.due_date).toLocaleDateString() : 'N/A'}</span>
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
              <p><b>Class:</b></p>
              <span>{assignmentData?.class_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Section:</b></p>
              <span>{assignmentData?.section_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Subject:</b></p>
              <span>{assignmentData?.subject_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Assigned By:</b></p>
              <span>{assignmentData?.assigned_by_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="assignment-detail-info mb-3">
              <p><b>Academic Year:</b></p>
              <span>{assignmentData?.academic_year_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="assignment-detail-info">
              <p><b>Created At:</b></p>
              <span>{assignmentData?.created_at ? new Date(assignmentData.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          {assignmentData?.assigned_date && (
            <div className="col-md-6">
              <div className="assignment-detail-info">
                <p><b>Assigned Date:</b></p>
                <span>{new Date(assignmentData.assigned_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

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
              {assignmentData.assigned_students.map((assignedStudent: AssignedStudent, index: number) => (
                <div key={assignedStudent.id} className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <div className="avatar avatar-sm">
                            <span className="avatar-title bg-primary text-white rounded-circle fw-bold">
                              {assignedStudent.student_name?.split(' ')[0]?.charAt(0)}{assignedStudent.student_name?.split(' ')[1]?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 text-truncate">
                            {assignedStudent.student_name}
                          </h6>
                          <div className="text-muted small">
                            <div>Student ID: <span className="fw-medium">{assignedStudent.student_id}</span></div>
                            <div>Assigned: <span className="fw-medium">{new Date(assignedStudent.created_at).toLocaleDateString()}</span></div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="badge bg-light text-dark">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
  );
};

export default AssignmentDetailsView;