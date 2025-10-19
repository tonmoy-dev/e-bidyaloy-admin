import { Table } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetExamMarksQuery } from '../api/examMarkApi';
import { useExamMarkMutations } from '../hooks/useExamMarkMutations';
import type { ExamMarkModel } from '../models/exam-mark.model';

interface ExamMarkListProps {
  onEdit?: (examMark: ExamMarkModel) => void;
  onDelete?: (id: string) => void;
}

const ExamMarkList: React.FC<ExamMarkListProps> = ({ onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetExamMarksQuery(currentPage);
  const { deleteExamMark } = useExamMarkMutations();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam mark?')) {
      const result = await deleteExamMark(id);
      if (result.success) {
        onDelete?.(id);
        refetch();
      } else {
        console.error('Failed to delete exam mark:', result.error);
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (record: ExamMarkModel) => (
        <Link to="#" className="link-primary">
          {record.id.slice(0, 8)}...
        </Link>
      ),
      sorter: (a: ExamMarkModel, b: ExamMarkModel) => a.id.localeCompare(b.id),
    },
    {
      title: 'Exam',
      dataIndex: 'exam_name',
      render: (record: ExamMarkModel) => record.exam_name || 'N/A',
      sorter: (a: ExamMarkModel, b: ExamMarkModel) =>
        (a.exam_name || '').localeCompare(b.exam_name || ''),
    },
    {
      title: 'Subject',
      dataIndex: 'subject_name',
      render: (record: ExamMarkModel) => record.subject_name || 'N/A',
      sorter: (a: ExamMarkModel, b: ExamMarkModel) =>
        (a.subject_name || '').localeCompare(b.subject_name || ''),
    },
    {
      title: 'Class',
      dataIndex: 'class_name',
      render: (record: ExamMarkModel) => record.class_name || 'N/A',
      sorter: (a: ExamMarkModel, b: ExamMarkModel) =>
        (a.class_name || '').localeCompare(b.class_name || ''),
    },
    {
      title: 'Section',
      dataIndex: 'section_name',
      render: (record: ExamMarkModel) => record.section_name || 'N/A',
      sorter: (a: ExamMarkModel, b: ExamMarkModel) =>
        (a.section_name || '').localeCompare(b.section_name || ''),
    },
    {
      title: 'Student',
      dataIndex: 'student_name',
      render: (record: ExamMarkModel) => (
        <div>
          <div className="fw-medium">{record.student_name || 'N/A'}</div>
          <small className="text-muted">Roll: {record.student_roll || 'N/A'}</small>
        </div>
      ),
      sorter: (a: ExamMarkModel, b: ExamMarkModel) =>
        (a.student_name || '').localeCompare(b.student_name || ''),
    },
    {
      title: 'Marks',
      dataIndex: 'marks_obtained',
      render: (record: ExamMarkModel) => (
        <div>
          <span className="fw-medium">{record.marks_obtained}</span>
          <span className="text-muted"> / {record.total_marks}</span>
        </div>
      ),
      sorter: (a: ExamMarkModel, b: ExamMarkModel) => a.marks_obtained - b.marks_obtained,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      render: (record: ExamMarkModel) => (
        <span className={`badge ${getGradeBadgeClass(record.grade)}`}>{record.grade || 'N/A'}</span>
      ),
      sorter: (a: ExamMarkModel, b: ExamMarkModel) => (a.grade || '').localeCompare(b.grade || ''),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      render: (record: ExamMarkModel) => {
        const percentage = ((record.marks_obtained / record.total_marks) * 100).toFixed(1);
        return (
          <span className={`fw-medium ${getPercentageClass(Number(percentage))}`}>
            {percentage}%
          </span>
        );
      },
      sorter: (a: ExamMarkModel, b: ExamMarkModel) => {
        const aPercentage = (a.marks_obtained / a.total_marks) * 100;
        const bPercentage = (b.marks_obtained / b.total_marks) * 100;
        return aPercentage - bPercentage;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (record: ExamMarkModel) => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit?.(record);
                  }}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1 text-danger"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(record.id);
                  }}
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const getGradeBadgeClass = (grade: string | undefined) => {
    if (!grade) return 'bg-secondary';

    const gradeUpper = grade.toUpperCase();
    if (gradeUpper.includes('A+') || gradeUpper.includes('A')) return 'bg-success';
    if (gradeUpper.includes('B+') || gradeUpper.includes('B')) return 'bg-info';
    if (gradeUpper.includes('C+') || gradeUpper.includes('C')) return 'bg-warning';
    if (gradeUpper.includes('D') || gradeUpper.includes('F')) return 'bg-danger';

    return 'bg-secondary';
  };

  const getPercentageClass = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-info';
    if (percentage >= 40) return 'text-warning';
    return 'text-danger';
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading exam marks. Please try again.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
        <h4 className="mb-3">Exam Marks List</h4>
        <div className="d-flex align-items-center flex-wrap">
          <div className="mb-3 me-2">
            <button className="btn btn-outline-light bg-white" onClick={() => refetch()}>
              <i className="ti ti-refresh me-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0 py-3">
        <Table columns={columns} dataSource={data?.results || []} Selection={true} />
      </div>
    </div>
  );
};

export default ExamMarkList;
