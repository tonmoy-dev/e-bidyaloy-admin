import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';

export interface ClassPerformance {
  id: string;
  className: string;
  progress: number;
  progressColor: string;
  studentImages: string[];
}

interface BestPerformersWidgetProps {
  title?: string;
  performances: ClassPerformance[];
  viewAllLink?: string;
}

const BestPerformersWidget = ({
  title = 'Best Performers',
  performances,
  viewAllLink,
}: BestPerformersWidgetProps) => {
  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {viewAllLink && (
          <Link to={viewAllLink} className="link-primary fw-medium">
            View All
          </Link>
        )}
      </div>
      <div className="card-body pb-1">
        {performances.map((performance, index) => (
          <div
            key={performance.id}
            className={`d-sm-flex align-items-center ${index === performances.length - 1 ? '' : index === 0 ? 'mb-1' : ''}`}
          >
            <div className="w-50 mb-2">
              <h6>{performance.className}</h6>
            </div>
            <div className="class-progress w-100 ms-sm-3 mb-3">
              <div
                className="progress justify-content-between"
                role="progressbar"
                aria-label="Basic example"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`progress-bar ${performance.progressColor}`}
                  style={{ width: `${performance.progress}%` }}
                >
                  <div className="avatar-list-stacked avatar-group-xs d-flex">
                    {performance.studentImages.map((image, imgIndex) => (
                      <span key={imgIndex} className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className={imgIndex < performance.studentImages.length - 1 ? 'border border-white' : ''}
                          src={image}
                          alt="img"
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <span className="badge">{performance.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestPerformersWidget;

