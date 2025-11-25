import { Link } from 'react-router-dom';

import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';
import CircleProgress from '../../../../studentDashboard/circleProgress';
import type { Homework } from '../../types/dashboard.types';

interface HomeWorksWidgetProps {
  title?: string;
  homeworks: Homework[];
  subjectFilter?: string;
  onSubjectFilterChange?: (subject: string) => void;
  subjectOptions?: Array<{ label: string; value: string }>;
  showProgress?: boolean;
}

const HomeWorksWidget = ({
  title = 'Home Works',
  homeworks,
  subjectFilter = 'All Subject',
  onSubjectFilterChange,
  subjectOptions = [
    { label: 'All Subject', value: 'All Subject' },
    { label: 'Physics', value: 'Physics' },
    { label: 'Chemistry', value: 'Chemistry' },
    { label: 'Maths', value: 'Maths' },
  ],
  showProgress = false,
}: HomeWorksWidgetProps) => {
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Physics: 'text-info',
      Chemistry: 'text-success',
      Maths: 'text-danger',
      English: 'text-skyblue',
      Engish: 'text-skyblue',
    };
    return colors[subject] || 'text-primary';
  };

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-titile">{title}</h4>
        {onSubjectFilterChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-book-2 me-2" />
              {subjectFilter}
            </Link>
            <ul className="dropdown-menu mt-2 p-3">
              {subjectOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    to="#"
                    className="dropdown-item rounded-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubjectFilterChange(option.value);
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
      <div className="card-body py-1">
        <ul className="list-group list-group-flush">
          {homeworks.map((homework, index) => (
            <li
              key={homework.id}
              className={`list-group-item py-3 px-0 ${index === 0 ? 'pt-0' : ''} ${
                index === homeworks.length - 1 ? 'pb-0' : ''
              }`}
            >
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-center overflow-hidden mb-3">
                  <Link to="#" className="avatar avatar-xl flex-shrink-0 me-2">
                    <ImageWithBasePath src={homework.image} alt="img" />
                  </Link>
                  <div className="overflow-hidden">
                    <p
                      className={`d-flex align-items-center ${getSubjectColor(
                        homework.subject,
                      )} mb-1`}
                    >
                      <i className="ti ti-tag me-2" />
                      {homework.subject}
                    </p>
                    <h6 className="text-truncate mb-1">
                      <Link to="#">{homework.title}</Link>
                    </h6>
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="d-flex align-items-center border-end me-1 pe-1">
                        <Link to="#" className="avatar avatar-xs flex-shrink-0 me-2">
                          <ImageWithBasePath
                            src={homework.teacherImage}
                            className="rounded-circle"
                            alt="teacher"
                          />
                        </Link>
                        <p className="text-dark">{homework.teacherName}</p>
                      </div>
                      <p>Due by : {homework.dueDate}</p>
                    </div>
                  </div>
                </div>
                {showProgress && homework.progress !== undefined && (
                  <CircleProgress value={homework.progress} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomeWorksWidget;
