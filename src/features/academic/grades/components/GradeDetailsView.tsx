import type { GradeModel } from '../models/grade.model';

const GradeDetailsView = ({ gradeData }: { gradeData: GradeModel }) => {
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="badge badge-soft-success d-inline-flex align-items-center">
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          Active
        </span>
      );
    }
    return (
      <span className="badge badge-soft-secondary d-inline-flex align-items-center">
        <i className="ti ti-circle-filled fs-5 me-1"></i>
        Inactive
      </span>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Name</p>
          <span>{gradeData?.name}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Level</p>
          <span>{gradeData?.level}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Status</p>
          {getStatusBadge(gradeData?.is_active)}
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Created At</p>
          <span>
            {gradeData?.created_at
              ? new Date(gradeData.created_at).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Updated At</p>
          <span>
            {gradeData?.updated_at
              ? new Date(gradeData.updated_at).toLocaleDateString()
              : 'N/A'}
          </span>
        </div>
      </div>
      <div className="col-md-12">
        <div className="subject-detail-info mb-3">
          <p className="fw-bold">Description</p>
          <span>{gradeData?.description || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default GradeDetailsView;
