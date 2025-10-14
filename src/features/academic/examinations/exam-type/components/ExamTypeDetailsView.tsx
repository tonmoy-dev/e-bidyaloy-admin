import type { ExamTypeModel } from '../models/exam-type.model';

const ExamTypeDetailsView = ({ examTypeData }: { examTypeData: ExamTypeModel }) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="exam-type-detail-info mb-3">
          <p>Exam Type Name</p>
          <span>{examTypeData?.name}</span>
        </div>
      </div>

      <div className="col-md-6">
        <div className="exam-type-detail-info mb-3">
          <p>Weightage</p>
          <span>{examTypeData?.weightage}%</span>
        </div>
      </div>

      <div className="col-md-12">
        <div className="exam-type-detail-info mb-3">
          <p>Description</p>
          <span>{examTypeData?.description || 'N/A'}</span>
        </div>
      </div>

      <div className="col-md-6">
        <div className="exam-type-detail-info mb-3">
          <p>Organization</p>
          <span>{examTypeData?.organization_name || 'N/A'}</span>
        </div>
      </div>

      <div className="col-md-6">
        <div className="exam-type-detail-info mb-3">
          <p>Exam Count</p>
          <span>{examTypeData?.exam_count || '0'}</span>
        </div>
      </div>

      <div className="col-md-6">
        <div className="exam-type-detail-info">
          <p>Created At</p>
          <span>{examTypeData?.created_at ? new Date(examTypeData.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default ExamTypeDetailsView;