import type { ClassModel, SectionModel } from '../models/class.model';

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
          <p>Class Teacher</p>
          <span>
            {classData?.class_teacher
              ? `${classData?.class_teacher?.first_name} ${classData?.class_teacher?.last_name}`
              : 'N/A'}
          </span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="class-detail-info mb-3">
          <p>Section</p>
          <span>
            <div className="d-flex flex-column g-4">
              {classData?.sections?.map((section: SectionModel) => (
                <p>{section.name}</p>
              ))}
            </div>
          </span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="class-detail-info mb-3">
          <p>Section Teacher</p>

          <div className="d-flex flex-column g-4">
            {classData?.sections?.map((section: SectionModel, idx: number) => (
              <p key={idx}>
                {section?.section_teacher
                  ? `${section?.section_teacher?.first_name} ${section?.section_teacher?.last_name}`
                  : 'N/A'}
              </p>
            ))}
          </div>
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
