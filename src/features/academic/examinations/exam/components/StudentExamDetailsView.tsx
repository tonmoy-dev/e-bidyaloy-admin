import React from 'react';
import type { ExamDetails } from '../models/exam.model';

interface StudentExamDetailsViewProps {
  examData: ExamDetails;
}

const StudentExamDetailsView: React.FC<StudentExamDetailsViewProps> = ({ examData }) => {
  return (
    <div className="student-exam-routine">
      <style>
        {`
          .routine-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: ;
            color: #0a0a0a;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
          }
          
          .routine-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .routine-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 0;
          }
          
          .exam-info-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .exam-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }
          
          .info-value {
            font-size: 1rem;
            color: #212529;
            font-weight: 500;
          }
          
          .subjects-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .table-header {
            background: #f6f8fa;
            color: #0a0a0a;
            padding: 1rem;
            font-size: 1.1rem;
            font-weight: 600;
            text-align: center;
            border: 1px solid #e0e0e0;
          }
          
          .subjects-table table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .subjects-table th {
            background: #8d8e8f;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
          }
          
          .subjects-table td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #dee2e6;
            vertical-align: middle;
          }
          
          .subjects-table tbody tr:hover {
            background-color: #f8f9fa;
          }
          
          .subjects-table tbody tr:nth-child(even) {
            background-color: #fbfbfb;
          }
          
          .no-subjects {
            text-align: center;
            padding: 2rem;
            color: #6c757d;
            font-style: italic;
          }
          
          @media (max-width: 768px) {
            .routine-title {
              font-size: 1.5rem;
            }
            
            .routine-subtitle {
              font-size: 1rem;
            }
            
            .exam-info-grid {
              grid-template-columns: 1fr;
            }
            
            .subjects-table {
              font-size: 0.9rem;
            }
            
            .subjects-table th,
            .subjects-table td {
              padding: 8px 4px;
            }
          }
        `}
      </style>

      {/* Routine Header */}
      <div className="routine-header">
        <div className="routine-title">{examData.name}</div>
        <div className="routine-subtitle">
          Class: {examData.class_name} | Section: {examData.section_name || 'All Sections'}
        </div>
      </div>

      {/* Exam Information */}
      <div className="exam-info-card">
        <div className="exam-info-grid">
          <div className="info-item">
            <span className="info-label">Exam Name</span>
            <span className="info-value">{examData.name}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Instructions</span>
            <span className="info-value">{examData.instructions || 'No specific instructions'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Start Date</span>
            <span className="info-value">
              {examData.start_date ? new Date(examData.start_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">End Date</span>
            <span className="info-value">
              {examData.end_date ? new Date(examData.end_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Exam Subjects Schedule */}
      <div className="subjects-table">
        <div className="table-header">
          Exam Schedule - Subjects
        </div>
        
        {examData.exam_subjects && examData.exam_subjects.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {examData.exam_subjects.map((subject, index) => (
                <tr key={index}>
                  <td>
                    <strong>{subject.subject_name || 'N/A'}</strong>
                  </td>
                  <td>
                    {subject.exam_date ? new Date(subject.exam_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'TBD'}
                  </td>
                  <td>
                    {subject.start_time 
                      ? `${new Date(`1970-01-01T${subject.start_time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}${subject.duration_minutes ? ` (${subject.duration_minutes} min)` : ''}`
                      : 'TBD'
                    }
                  </td>
                  <td>{subject.room_number || 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-subjects">
            <i className="ti ti-calendar-x fs-1 mb-2 d-block"></i>
            No exam schedule available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExamDetailsView;