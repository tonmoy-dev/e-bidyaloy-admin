import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface TableHeaderProps {
  filters?: React.ReactNode;
  sortingOptions?: string[];
  onApply?: () => void;
  onReset?: () => void;
  onSortChange?: (option: string) => void;
  defaultSort?: string;
}

const DataTableHeader: React.FC<TableHeaderProps> = ({
  filters,
  sortingOptions = [],
  onSortChange,
  defaultSort = '',
}) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="search-global text-right w-25">
        <input
          type="search"
          className="form-control form-control-sm mb-3 p-2 float-end"
          value={searchText}
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          aria-controls="DataTables_Table_0"
        ></input>
      </div>
      <div className="d-flex align-items-center g-4">
        {/* Filter Dropdown */}
        {filters}
        {/* Sort Dropdown */}
        <div className="dropdown mb-3">
          <Link
            to="#"
            className="btn btn-outline-light bg-white dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="ti ti-sort-ascending-2 me-2" />
            Sort
          </Link>
          <ul className="dropdown-menu p-3">
            {sortingOptions.map((option, idx) => (
              <li key={idx}>
                <button
                  className={`dropdown-item rounded-1 ${defaultSort === option ? 'active' : ''}`}
                  onClick={() => onSortChange && onSortChange(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;
