import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface StudentActivityWidgetProps {
  title?: string;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  activities: ActivityItem[];
}

const StudentActivityWidget = ({
  title = 'Student Activity',
  dateRange = 'This Month',
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'This Month', value: 'This Month' },
    { label: 'This Year', value: 'This Year' },
    { label: 'Last Week', value: 'Last Week' },
  ],
  activities,
}: StudentActivityWidgetProps) => {
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
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`d-flex align-items-center overflow-hidden p-3 ${
              index === activities.length - 1 ? 'mb-0' : 'mb-3'
            } border rounded`}
          >
            <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
              <ImageWithBasePath src={activity.image} alt={activity.title} />
            </span>
            <div className="overflow-hidden">
              <h6 className="mb-1 text-truncate">{activity.title}</h6>
              <p className={index === activities.length - 1 ? 'text-truncate' : ''}>
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentActivityWidget;
