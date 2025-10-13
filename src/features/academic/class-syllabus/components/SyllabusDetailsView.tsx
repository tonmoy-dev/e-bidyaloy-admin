import { useClassesWithoutPagination } from '../../class-subject/hooks/useGetClassesQueryWP';
import type { SyllabusModel } from '../models/syllabus.model';
import { useSubjectsWithoutPagination } from '../hooks/useSubjectsWP';

const SyllabusDetailsView = ({ syllabusData }: { syllabusData: SyllabusModel }) => {
  // Fetch classes and subjects for ID to name mapping
  const { classes } = useClassesWithoutPagination();
  const { subjects } = useSubjectsWithoutPagination();

  // Helper functions to get names from IDs
  const getClassName = (classId: string) => {
    const classItem = classes?.find((c) => c.id === classId);
    return classItem?.name || 'N/A';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects?.find((s) => s.id === subjectId);
    return subject?.name || 'N/A';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="badge badge-soft-warning d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="badge badge-soft-secondary d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Archived
          </span>
        );
      default:
        return (
          <span className="badge badge-soft-secondary d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Title</p>
          <span>{syllabusData?.title}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Status</p>
          {getStatusBadge(syllabusData?.status)}
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Subject</p>
          <span>{getSubjectName(syllabusData?.subject)}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Class</p>
          <span>{getClassName(syllabusData?.classes)}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Created At</p>
          <span>
            {syllabusData?.created_at
              ? new Date(syllabusData.created_at).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
      </div>
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Description</p>
          <span>{syllabusData?.description || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Content</p>
          <span className="text-pre-wrap">{syllabusData?.content || 'N/A'}</span>
        </div>
      </div>
      {syllabusData?.file_url && (
        <div className="col-md-12">
          <div className="subject-detail-info mb-3">
            <p className="fw-bold">File URL</p>
            <a href={syllabusData.file_url} target="_blank" rel="noopener noreferrer">
              {syllabusData.file_url}
            </a>
          </div>
        </div>
      )}
      {syllabusData?.pdf_file && (
        <div className="col-md-12">
          <div className="subject-detail-info mb-3">
            <p className="fw-bold">PDF File</p>
            <a href={syllabusData.pdf_file} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusDetailsView;
