import type React from 'react';
import { Link } from 'react-router-dom';

type BreadcrumbItem = { label: string; path?: string };
type PageHeaderProps = {
  title: string;
  breadcrumb: BreadcrumbItem[];
  onAddClick?: () => void;
  addButtonLabel?: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  onAddClick,
  addButtonLabel = 'Add',
  children,
}) => (
  <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
    <div className="my-auto mb-2">
      <h3 className="page-title mb-1">{title}</h3>
      <nav>
        <ol className="breadcrumb mb-0">
          {breadcrumb.map((item, i) => (
            <li
              key={i}
              className={`breadcrumb-item ${i === breadcrumb.length - 1 ? 'active' : ''}`}
            >
              {item.path && i !== breadcrumb.length - 1 ? (
                <Link to={item.path}>{item.label}</Link>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>

    <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
      {children}
      {onAddClick && (
        <button className="btn btn-primary mb-2" onClick={onAddClick}>
          <i className="ti ti-square-rounded-plus-filled me-2" />
          {addButtonLabel}
        </button>
      )}
    </div>
  </div>
);

export default PageHeader;
