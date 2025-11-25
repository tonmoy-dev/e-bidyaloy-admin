import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";

export interface ProgressItem {
  id: string;
  label: string;
  progress: number;
  image?: string;
  progressColor?: string;
}

interface ProgressListWidgetProps {
  title: string;
  items: ProgressItem[];
  addNewLink?: string;
  addNewModalTarget?: string;
  showImage?: boolean;
  defaultProgressColor?: string;
}

const ProgressListWidget = ({
  title,
  items,
  addNewLink,
  addNewModalTarget,
  showImage = false,
  defaultProgressColor = "bg-primary",
}: ProgressListWidgetProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {(addNewLink || addNewModalTarget) && (
          <Link
            to={addNewLink || "#"}
            className="link-primary fw-medium"
            data-bs-toggle={addNewModalTarget ? "modal" : undefined}
            data-bs-target={addNewModalTarget}
          >
            <i className="ti ti-square-plus me-1" />
            Add New
          </Link>
        )}
      </div>
      <div className="card-body">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`d-flex align-items-center rounded border p-3 ${index === items.length - 1 ? "mb-0" : "mb-3"}`}
          >
            {showImage && item.image && (
              <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                <ImageWithBasePath src={item.image} className="rounded" alt={item.label} />
              </span>
            )}
            <div className="w-100">
              <p className="mb-1">{item.label}</p>
              <div className="progress progress-xs flex-grow-1 mb-1">
                <div
                  className={`progress-bar progress-bar-striped progress-bar-animated ${item.progressColor || defaultProgressColor} rounded`}
                  role="progressbar"
                  style={{ width: `${item.progress}%` }}
                  aria-valuenow={item.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressListWidget;

