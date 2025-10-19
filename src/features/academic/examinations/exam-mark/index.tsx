import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../router/all_routes';
import ExamMarkForm from './components/ExamMarkForm';
import ExamMarkList from './components/ExamMarkList';
import type { ExamMarkModel } from './models/exam-mark.model';

const ExamMark = () => {
  const routes = all_routes;
  const [showForm, setShowForm] = useState(false);
  const [editingExamMark, setEditingExamMark] = useState<ExamMarkModel | null>(null);

  const handleAddNew = () => {
    setEditingExamMark(null);
    setShowForm(true);
  };

  const handleEdit = (examMark: ExamMarkModel) => {
    setEditingExamMark(examMark);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExamMark(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExamMark(null);
  };

  const handleDelete = (id: string) => {
    // The delete logic is handled in the ExamMarkList component
    console.log('Exam mark deleted:', id);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Marks</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Examinations</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Marks
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAddNew}
                  data-bs-toggle="modal"
                  data-bs-target="#examMarkModal"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Exam Marks
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Exam Marks List */}
          <ExamMarkList onEdit={handleEdit} onDelete={handleDelete} />
          {/* /Exam Marks List */}
        </div>
      </div>

      {/* Exam Mark Modal */}
      <div className="modal fade" id="examMarkModal" tabIndex={-1} aria-labelledby="examMarkModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="examMarkModalLabel">
                {editingExamMark ? 'Edit Exam Marks' : 'Add Exam Marks'}
              </h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleFormCancel}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <ExamMarkForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                initialData={editingExamMark ? {
                  exam: editingExamMark.exam,
                  subject: editingExamMark.subject,
                  class: editingExamMark.class,
                  section: editingExamMark.section,
                  studentMarks: [{
                    student: editingExamMark.student,
                    student_name: editingExamMark.student_name || '',
                    student_roll: editingExamMark.student_roll || '',
                    marks_obtained: editingExamMark.marks_obtained,
                    total_marks: editingExamMark.total_marks,
                    grade: editingExamMark.grade,
                    remarks: editingExamMark.remarks,
                  }]
                } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Exam Mark Modal */}
    </div>
  );
};

export default ExamMark;