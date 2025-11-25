import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";

export interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  image: string;
  leaveType: string;
  leaveTypeBadgeColor: string;
  leaveDate: string;
  applyDate: string;
  profileLink?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

interface LeaveRequestsWidgetProps {
  title?: string;
  requests: LeaveRequest[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
}

const LeaveRequestsWidget = ({
  title = "Leave Requests",
  requests,
  dateRange = "Today",
  onDateRangeChange,
  dateRangeOptions = [
    { label: "This Week", value: "This Week" },
    { label: "Last Week", value: "Last Week" },
  ],
}: LeaveRequestsWidgetProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-calendar-due me-1" />
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
        {requests.map((request, index) => (
          <div key={request.id} className={`card ${index === requests.length - 1 ? "mb-0" : "mb-2"}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center overflow-hidden me-2">
                  <Link
                    to={request.profileLink || "#"}
                    className="avatar avatar-lg flex-shrink-0 me-2"
                  >
                    <ImageWithBasePath src={request.image} alt={request.name} />
                  </Link>
                  <div className="overflow-hidden">
                    <h6 className="mb-1 text-truncate">
                      <Link to={request.profileLink || "#"}>{request.name}</Link>
                      <span className={`badge ${request.leaveTypeBadgeColor} ms-1`}>
                        {request.leaveType}
                      </span>
                    </h6>
                    <p className="text-truncate">{request.role}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  {request.onApprove && (
                    <Link
                      to="#"
                      className="avatar avatar-xs p-0 btn btn-success me-1"
                      onClick={(e) => {
                        e.preventDefault();
                        request.onApprove?.(request.id);
                      }}
                    >
                      <i className="ti ti-checks" />
                    </Link>
                  )}
                  {request.onReject && (
                    <Link
                      to="#"
                      className="avatar avatar-xs p-0 btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        request.onReject?.(request.id);
                      }}
                    >
                      <i className="ti ti-x" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between border-top pt-3">
                <p className="mb-0">
                  Leave : <span className="fw-semibold">{request.leaveDate}</span>
                </p>
                <p>
                  Apply on : <span className="fw-semibold">{request.applyDate}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveRequestsWidget;

