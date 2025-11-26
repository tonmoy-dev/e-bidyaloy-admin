import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';

export interface StudentProgressItem {
  id: string;
  name: string;
  image: string;
  class: string;
  progress: number;
  progressColor?: string;
  medalIcon?: string;
}

interface StudentProgressWidgetProps {
  title?: string;
  students: StudentProgressItem[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
}

const StudentProgressWidget = ({
  title = 'Student Progress',
  students,
  dateRange = 'This Month',
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'This Month', value: 'This Month' },
    { label: 'This Year', value: 'This Year' },
    { label: 'Last Week', value: 'Last Week' },
  ],
}: StudentProgressWidgetProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-calendar me-2" />
              {dateRange}
            </Link>
            <ul className="dropdown-menu mt-2 p-3">
              {dateRangeOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    to="#"
                    className="dropdown-item rounded-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onDateRangeChange(option.value);
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
        {students.map((student, index) => (
          <div
            key={student.id}
            className={`d-flex align-items-center justify-content-between p-3 ${
              index === students.length - 1 ? 'mb-0' : 'mb-2'
            } border ${index === students.length - 1 ? 'rounded' : 'br-5'}`}
          >
            <div className="d-flex align-items-center overflow-hidden me-2">
              <Link to="#" className="avatar avatar-lg flex-shrink-0 br-6 me-2">
                <ImageWithBasePath src={student.image} alt="student" />
              </Link>
              <div className="overflow-hidden">
                <h6 className="mb-1 text-truncate">
                  <Link to="#">{student.name}</Link>
                </h6>
                <p>{student.class}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {student.medalIcon && (
                <ImageWithBasePath src={student.medalIcon} alt="icon" />
              )}
              <span className={`badge ${student.progressColor || 'badge-success'} ms-2`}>
                {student.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProgressWidget;

