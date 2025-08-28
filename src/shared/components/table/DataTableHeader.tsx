import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  label: string; // e.g., "Class"
  options: FilterOption[]; // [{label: "Class 1", value: "class1"}]
  onChange: (selected: FilterOption) => void;
  defaultValue?: FilterOption;
}

export interface TableHeaderProps {
  filters?: FilterConfig[];
  sortingOptions?: string[];
  onApply?: () => void;
  onReset?: () => void;
  onSortChange?: (option: string) => void;
  defaultSort?: string;
}

const DataTableHeader: React.FC<TableHeaderProps> = ({
  filters = [],
  sortingOptions = [],
  onApply,
  onReset,
  onSortChange,
  defaultSort = '',
}) => {
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <div className="d-flex align-items-center flex-wrap">
      <div className="serch-global text-right">
        <input
          type="search"
          className="form-control form-control-sm mb-3 w-auto float-end"
          value={searchText}
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          aria-controls="DataTables_Table_0"
        ></input>
      </div>
      {/* Filter Dropdown */}
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
        <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
          <form>
            <div className="d-flex align-items-center border-bottom p-3">
              <h4>Filter</h4>
            </div>
            <div className="p-3 border-bottom pb-0">
              <div className="row">
                {/* {filters.map((filter: FilterConfig, idx) => (
                  <div className="col-md-12" key={idx}>
                    <div className="mb-3">
                      <label className="form-label">{filter.label}</label>
                      <CommonSelect
                        className="select"
                        options={filter.options}
                        defaultValue={filter.defaultValue || filter.options[0]}
                        onChange={(selected: any) => filter.onChange(selected)}
                      />
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
            <div className="p-3 d-flex align-items-center justify-content-end">
              <button type="button" className="btn btn-light me-3" onClick={onReset}>
                Reset
              </button>
              <button type="button" className="btn btn-primary" onClick={onApply}>
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>

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
  );
};

export default DataTableHeader;
