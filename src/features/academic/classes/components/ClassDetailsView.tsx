import type { ClassModel } from '../models/class.model';

const ClassDetailsView = ({ classData }: { classData: ClassModel }) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="class-detail-info mb-3">
          <p>Class Name</p>
          <span>{classData?.name}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="class-detail-info mb-3">
          <p>Academic year</p>
          <span>{classData?.academic_year_name}</span>
        </div>
      </div>

      {/* <div className="col-md-6">
        <div className="class-detail-info">
          <p>No of Students</p>
          <span>25</span>
        </div>
      </div> */}
    </div>
  );
};

export default ClassDetailsView;
