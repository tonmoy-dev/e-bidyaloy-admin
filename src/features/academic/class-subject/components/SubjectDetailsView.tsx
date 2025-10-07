import type { SubjectModel } from '../models/subject.model';

const SubjectDetailsView = ({ subjectData }: { subjectData: SubjectModel }) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Subject Name</p>
          <span>{subjectData?.name}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Subject Code</p>
          <span>{subjectData?.code}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Subject Type</p>
          <span className="text-capitalize">{subjectData?.subject_type}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Class</p>
          <span>{subjectData?.classes || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Description</p>
          <span>{subjectData?.description || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Organization</p>
          <span>{subjectData?.organization_name || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Teacher Count</p>
          <span>{subjectData?.teacher_count || 0}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Created At</p>
          <span>
            {subjectData?.created_at
              ? new Date(subjectData.created_at).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsView;
