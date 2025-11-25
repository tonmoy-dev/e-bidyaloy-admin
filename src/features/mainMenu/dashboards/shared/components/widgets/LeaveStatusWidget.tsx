import { Link } from "react-router-dom";
import type { Leave } from "../../types/dashboard.types";

interface LeaveStatusWidgetProps {
  title?: string;
  leaves: Leave[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  viewAllLink?: string;
}

const LeaveStatusWidget = ({
  title = "Leave Status",
  leaves,
  dateRange = "This Month",
  onDateRangeChange,
  dateRangeOptions = [
    { label: "This Month", value: "This Month" },
    { label: "This Year", value: "This Year" },
    { label: "Last Week", value: "Last Week" },
  ],
  viewAllLink,
}: LeaveStatusWidgetProps) => {
  const getLeaveIcon = (type: Leave["type"]) => {
    switch (type) {
      case "Emergency":
      case "Not Well":
      case "Fever":
        return "ti ti-brand-socket-io";
      case "Medical":
        return "ti ti-medical-cross";
      case "Casual":
        return "ti ti-calendar-event";
      default:
        return "ti ti-calendar";
    }
  };

  const getLeaveIconBg = (type: Leave["type"]) => {
    switch (type) {
      case "Emergency":
      case "Not Well":
      case "Fever":
        return "bg-danger-transparent";
      case "Medical":
        return "bg-info-transparent";
      case "Casual":
        return "bg-warning-transparent";
      default:
        return "bg-secondary-transparent";
    }
  };

  const getStatusBadgeClass = (status: Leave["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-success";
      case "Declined":
        return "bg-danger";
      case "Pending":
        return "bg-skyblue";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link
              to="#"
              className="bg-white dropdown-toggle"
              data-bs-toggle="dropdown"
            >
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
        {leaves.map((leave, index) => (
          <div
            key={leave.id}
            className={`bg-light-300 d-sm-flex align-items-center justify-content-between p-3 ${
              index < leaves.length - 1 ? "mb-3" : "mb-0"
            }`}
          >
            <div className="d-flex align-items-center mb-2 mb-sm-0">
              <div
                className={`avatar avatar-lg ${getLeaveIconBg(
                  leave.type
                )} flex-shrink-0 me-2`}
              >
                <i className={leave.icon || getLeaveIcon(leave.type)} />
              </div>
              <div>
                <h6 className="mb-1">{leave.type} Leave</h6>
                <p>Date : {leave.date}</p>
              </div>
            </div>
            <span
              className={`badge ${getStatusBadgeClass(
                leave.status
              )} d-inline-flex align-items-center`}
            >
              <i className="ti ti-circle-filled fs-5 me-1" />
              {leave.status}
            </span>
          </div>
        ))}
        {viewAllLink && (
          <div className="mt-3 text-center">
            <Link to={viewAllLink} className="link-primary fw-medium">
              View All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveStatusWidget;

