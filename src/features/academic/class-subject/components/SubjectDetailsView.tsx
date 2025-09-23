import type { SubjectModel } from '../models/subject.model';

const SubjectDetailsView = ({ subjectData }: { subjectData: SubjectModel }) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Subject Name</p>
          <span>{subjectData?.name}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Subject Code</p>
          <span>{subjectData?.code}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Subject Type</p>
          <span>{subjectData?.subject_type}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Description</p>
          <span>{subjectData?.description || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Organization</p>
          <span>{subjectData?.organization_name || 'N/A'}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Teacher Count</p>
          <span>{subjectData?.teacher_count || 0}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p>Created At</p>
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
