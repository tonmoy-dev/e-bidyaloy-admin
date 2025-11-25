import CountUp from 'react-countup';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';

export interface StatCardData {
  title: string;
  value: number;
  badge?: {
    text: string;
    color: string;
  };
  icon?: {
    src: string;
    alt: string;
    bgColor: string;
  };
  footer?: {
    active?: {
      label: string;
      value: number | string;
    };
    inactive?: {
      label: string;
      value: number | string;
    };
  };
}

interface StatCardProps {
  data: StatCardData;
  className?: string;
}

const StatCard = ({ data, className = '' }: StatCardProps) => {
  return (
    <div className={`card flex-fill animate-card border-0 ${className}`}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          {data.icon && (
            <div className={`avatar avatar-xl ${data.icon.bgColor} me-2 p-1`}>
              <ImageWithBasePath src={data.icon.src} alt={data.icon.alt} />
            </div>
          )}
          <div className="overflow-hidden flex-fill">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="counter">
                <CountUp end={data.value} />
              </h2>
              {data.badge && <span className={`badge ${data.badge.color}`}>{data.badge.text}</span>}
            </div>
            <p>{data.title}</p>
          </div>
        </div>
        {data.footer && (data.footer.active || data.footer.inactive) && (
          <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
            {data.footer.active && (
              <p className="mb-0">
                {data.footer.active.label} :{' '}
                <span className="text-dark fw-semibold">{data.footer.active.value}</span>
              </p>
            )}
            {data.footer.active && data.footer.inactive && <span className="text-light">|</span>}
            {data.footer.inactive && (
              <p>
                {data.footer.inactive.label} :{' '}
                <span className="text-dark fw-semibold">{data.footer.inactive.value}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
