import { Link } from "react-router-dom";
import type { Fee } from "../../types/dashboard.types";

interface FeesReminderWidgetProps {
  title?: string;
  fees: Fee[];
  viewAllLink?: string;
  showPayButton?: boolean;
  onPayClick?: (feeId: string) => void;
}

const FeesReminderWidget = ({
  title = "Fees Reminder",
  fees,
  viewAllLink,
  showPayButton = false,
  onPayClick,
}: FeesReminderWidgetProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-titile">{title}</h4>
        {viewAllLink && (
          <Link to={viewAllLink} className="link-primary fw-medium">
            View All
          </Link>
        )}
      </div>
      <div className="card-body py-1">
        {fees.map((fee, index) => (
          <div
            key={fee.id}
            className={`d-flex align-items-center justify-content-between py-3 ${
              index === fees.length - 1 ? "" : "border-bottom"
            }`}
          >
            <div className="d-flex align-items-center overflow-hidden me-2">
              <span
                className={`${fee.iconBgColor} avatar avatar-lg me-2 rounded-circle flex-shrink-0`}
              >
                <i className={`${fee.icon} fs-16`} />
              </span>
              <div className="overflow-hidden">
                <h6 className="text-truncate mb-1">
                  {fee.type}
                  {fee.isDue && (
                    <span className="d-inline-flex align-items-center badge badge-soft-danger ms-1">
                      <i className="ti ti-circle-filled me-1 fs-5" />
                      Due
                    </span>
                  )}
                </h6>
                <p className={fee.isDue ? "text-danger" : ""}>
                  {fee.dueAmount || fee.amount}
                </p>
              </div>
            </div>
            <div className="text-end">
              {showPayButton && fee.isDue && onPayClick ? (
                <Link
                  to="#"
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onPayClick(fee.id);
                  }}
                >
                  Pay now
                </Link>
              ) : (
                <>
                  <h6 className="mb-1">Last Date</h6>
                  <p>{fee.lastDate}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesReminderWidget;

