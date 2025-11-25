import { Link } from "react-router-dom";
import type { Notice } from "../../types/dashboard.types";

interface NoticeBoardWidgetProps {
  title?: string;
  notices: Notice[];
  viewAllLink?: string;
  showDaysRemaining?: boolean;
}

const NoticeBoardWidget = ({
  title = "Notice Board",
  notices,
  viewAllLink,
  showDaysRemaining = true,
}: NoticeBoardWidgetProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {viewAllLink && (
          <Link to={viewAllLink} className="fw-medium">
            View All
          </Link>
        )}
      </div>
      <div className="card-body">
        <div className="notice-widget">
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              className={`d-flex align-items-center justify-content-between ${
                index < notices.length - 1 ? "mb-4" : "mb-0"
              }`}
            >
              <div className="d-flex align-items-center overflow-hidden me-2">
                <span
                  className={`${notice.iconBgColor} avatar avatar-md me-2 rounded-circle flex-shrink-0`}
                >
                  <i className={`${notice.icon} fs-16`} />
                </span>
                <div className="overflow-hidden">
                  <h6 className="text-truncate mb-1">{notice.title}</h6>
                  <p>
                    <i className="ti ti-calendar me-2" />
                    Added on : {notice.date}
                  </p>
                </div>
              </div>
              {viewAllLink && (
                <Link to={viewAllLink}>
                  {showDaysRemaining && notice.daysRemaining !== undefined ? (
                    <span className="badge bg-light text-dark">
                      <i className="ti ti-clck me-1" />
                      {notice.daysRemaining} Days
                    </span>
                  ) : (
                    <i className="ti ti-chevron-right fs-16" />
                  )}
                </Link>
              )}
              {!viewAllLink && showDaysRemaining && notice.daysRemaining !== undefined && (
                <span className="badge bg-light text-dark">
                  <i className="ti ti-clck me-1" />
                  {notice.daysRemaining} Days
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoardWidget;

