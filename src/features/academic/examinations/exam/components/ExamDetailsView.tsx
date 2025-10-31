import type { ExamModel } from '../models/exam.model';

const ExamDetailsView = ({ examData }: { examData: ExamModel }) => {
  return (
    <div className="row">
      {/* Basic Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="exam-detail-info mb-3">
              <p><b>Exam Name:</b></p>
              <span>{examData?.name}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="exam-detail-info mb-3">
              <p><b>Status:</b></p>
              <span className={`badge ${
                examData?.status === 'active' ? 'badge-soft-success' :
                examData?.status === 'scheduled' ? 'badge-soft-warning' :
                examData?.status === 'completed' ? 'badge-soft-info' :
                'badge-soft-danger'
              }`}>
                {examData?.status}
              </span>
            </div>
          </div>


          <div className="col-md-12">
            <div className="exam-detail-info mb-3">
              <p><b>Instructions:</b></p>
              <span>{examData?.instructions || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="col-md-12 mb-4">
        <h5 className="border-bottom pb-2 mb-3">Date Information</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>Start Date:</b></p>
              <span>{examData?.start_date ? new Date(examData.start_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>End Date:</b></p>
              <span>{examData?.end_date ? new Date(examData.end_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
            <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>Academic Year:</b></p>
              <span>{examData?.academic_year_name || 'N/A'}</span>
            </div>
          </div>


        </div>
      </div>

      {/* Academic Information */}
      <div className="col-md-12 mb-4">git
        <h5 className="border-bottom pb-2 mb-3">Academic Information</h5>
        <div className="row">
        
          <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>Exam Type:</b></p>
              <span>{examData?.exam_type_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>Class:</b></p>
              <span>{examData?.class_name || 'N/A'}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="exam-detail-info mb-3">
              <p><b>Section:</b></p>
              <span>{examData?.section_name || 'N/A'}</span>
            </div>
          </div>

      
        </div>
      </div>

      {/* Exam Subjects */}
      {examData?.exam_subjects && examData.exam_subjects.length > 0 && (
        <div className="col-md-12">
          <h5 className="border-bottom pb-2 mb-3">Exam Subjects</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Max Marks</th>
                  <th>Passing Marks</th>
                  <th>Room</th>
                  <th>Supervisor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {examData.exam_subjects.map((subject, index) => (
                  <tr key={subject.id || index}>
                    <td>
                      <div>
                        <strong>{subject.subject_name}</strong>
                        {subject.subject_code && (
                          <small className="text-muted d-block">({subject.subject_code})</small>
                        )}
                      </div>
                    </td>
                    <td>{subject.exam_date ? new Date(subject.exam_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {subject.start_time 
                        ? new Date(`1970-01-01T${subject.start_time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })
                        : 'N/A'
                      }
                    </td>
                    <td>{subject.duration_minutes ? `${subject.duration_minutes} min` : 'N/A'}</td>
                    <td>{subject.max_marks || 'N/A'}</td>
                    <td>{subject.passing_marks || 'N/A'}</td>
                    <td>{subject.room_number || 'N/A'}</td>
                    <td>{subject.supervisor_name || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        subject.status === 'active' ? 'badge-soft-success' :
                        subject.status === 'scheduled' ? 'badge-soft-warning' :
                        subject.status === 'completed' ? 'badge-soft-info' :
                        'badge-soft-danger'
                      }`}>
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetailsView;