// components/layout/PageFilter.tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';

type PageFilterProps = { onApply: () => void; children: React.ReactNode };

const PageFilter: React.FC<PageFilterProps> = ({ onApply, children }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleApply = () => {
    onApply();
    dropdownRef.current?.classList.remove('show');
  };

  return (
    <div className="dropdown mb-3 me-2">
      <Link
        to="#"
        className="btn btn-outline-light bg-white dropdown-toggle"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      >
        <i className="ti ti-filter me-2" />
        Filter
      </Link>
      <div className="dropdown-menu drop-width" ref={dropdownRef}>
        <form>
          <div className="d-flex align-items-center border-bottom p-3">
            <h4>Filter</h4>
          </div>
          <div className="p-3 border-bottom pb-0">{children}</div>
          <div className="p-3 d-flex align-items-center justify-content-end">
            <Link to="#" className="btn btn-light me-3">
              Reset
            </Link>
            <Link to="#" className="btn btn-primary" onClick={handleApply}>
              Apply
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageFilter;
