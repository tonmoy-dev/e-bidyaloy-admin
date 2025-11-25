import { Link } from 'react-router-dom';

export interface SubjectItem {
  id: string;
  name: string;
  progress: number;
  progressColor: string;
}

export interface TopSubjectsListProps {
  title?: string;
  selectedClass?: string;
  onClassChange?: (className: string) => void;
  classOptions?: Array<{ label: string; value: string }>;
  subjects: SubjectItem[];
  infoMessage?: string;
}

const TopSubjectsList = ({
  title = 'Top Subjects',
  selectedClass = 'Class II',
  onClassChange,
  classOptions = [
    { label: 'Class I', value: 'Class I' },
    { label: 'Class II', value: 'Class II' },
    { label: 'Class III', value: 'Class III' },
    { label: 'Class IV', value: 'Class IV' },
  ],
  subjects,
  infoMessage,
}: TopSubjectsListProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onClassChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-school-bell me-2" />
              {selectedClass}
            </Link>
            <ul className="dropdown-menu mt-2 p-3">
              {classOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    to="#"
                    className="dropdown-item rounded-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onClassChange(option.value);
                    }}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="card-body">
        {infoMessage && (
          <div className="alert alert-success d-flex align-items-center mb-24" role="alert">
            <i className="ti ti-info-square-rounded me-2 fs-14" />
            <div className="fs-14">{infoMessage}</div>
          </div>
        )}
        <ul className="list-group">
          {subjects.map((subject) => (
            <li key={subject.id} className="list-group-item">
              <div className="row align-items-center">
                <div className="col-sm-4">
                  <p className="text-dark">{subject.name}</p>
                </div>
                <div className="col-sm-8">
                  <div className="progress progress-xs flex-grow-1">
                    <div
                      className={`progress-bar ${subject.progressColor} rounded`}
                      role="progressbar"
                      style={{ width: `${subject.progress}%` }}
                      aria-valuenow={subject.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopSubjectsList;

