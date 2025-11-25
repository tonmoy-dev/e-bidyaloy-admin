import { Link } from "react-router-dom";
import type { TodoItem } from "../../types/dashboard.types";

interface TodoWidgetProps {
  title?: string;
  todos: TodoItem[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  onToggleComplete?: (id: string) => void;
}

const TodoWidget = ({
  title = "Todo",
  todos,
  dateRange = "Today",
  onDateRangeChange,
  dateRangeOptions = [
    { label: "Today", value: "Today" },
    { label: "This Month", value: "This Month" },
    { label: "This Year", value: "This Year" },
    { label: "Last Week", value: "Last Week" },
  ],
  onToggleComplete,
}: TodoWidgetProps) => {
  const getStatusBadgeClass = (status: TodoItem["status"]) => {
    switch (status) {
      case "Completed":
        return "badge-soft-success";
      case "Inprogress":
        return "badge-soft-skyblue";
      case "Yet to Start":
        return "badge-soft-warning";
      default:
        return "badge-soft-secondary";
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
        <ul className="list-group list-group-flush todo-list">
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className={`list-group-item py-3 px-0 ${
                index === 0 ? "pt-0" : ""
              } ${index === todos.length - 1 ? "pb-0" : ""}`}
            >
              <div className="d-sm-flex align-items-center justify-content-between">
                <div
                  className={`d-flex align-items-center overflow-hidden me-2 ${
                    todo.completed ? "todo-strike-content" : ""
                  }`}
                >
                  <div className="form-check form-check-md me-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => onToggleComplete?.(todo.id)}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="mb-1 text-truncate">{todo.title}</h6>
                    <p>{todo.time}</p>
                  </div>
                </div>
                <span
                  className={`badge ${getStatusBadgeClass(
                    todo.status
                  )} mt-2 mt-sm-0`}
                >
                  {todo.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoWidget;

