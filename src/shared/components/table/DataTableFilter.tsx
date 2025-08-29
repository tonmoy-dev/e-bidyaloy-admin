import React, { useEffect, useState, type RefObject } from 'react';
import { Link } from 'react-router';
import CommonSelect from '../../../core/common/commonSelect';

// Type for an individual filter option
export interface FilterOption {
  label: string;
  value: string | number;
}

// Type for a single filter config
export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: FilterOption | null;
}

// Props for the reusable TableFilter component
interface TableFilterProps {
  filters: FilterConfig[];
  onApply: (selected: Record<string, FilterOption | null>) => void;
  onReset: (selected: Record<string, FilterOption | null>) => void;
  dropdownMenuRef?: RefObject<HTMLDivElement>;
}

const TableFilter: React.FC<TableFilterProps> = ({
  filters,
  onApply,
  onReset,
  dropdownMenuRef,
}) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, FilterOption | null>>({});

  // Initialize state with default values
  useEffect(() => {
    const initial: Record<string, FilterOption | null> = {};
    filters.forEach((filter) => {
      initial[filter.key] = filter.defaultValue || null;
    });
    setSelectedValues(initial);
  }, [filters]);

  const handleSelectChange = (key: string, value: FilterOption | null) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyClick = () => {
    onApply(selectedValues);
  };

  const handleResetClick = () => {
    const resetValues: Record<string, FilterOption | null> = {};
    filters.forEach((filter) => {
      resetValues[filter.key] = filter.defaultValue || null;
    });
    setSelectedValues(resetValues);
    onReset(resetValues);
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
      <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
        <form>
          <div className="d-flex align-items-center border-bottom p-3">
            <h4>Filter</h4>
          </div>
          <div className="p-3 border-bottom pb-0">
            <div className="row">
              {filters.map(({ key, label, options }) => (
                <div className="col-md-12" key={key}>
                  <div className="mb-3">
                    <label className="form-label">{label}</label>
                    <CommonSelect
                      className="select"
                      options={options}
                      value={selectedValues[key]}
                      onChange={(value: FilterOption | null) => handleSelectChange(key, value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 d-flex align-items-center justify-content-end">
            <Link to="#" className="btn btn-light me-3" onClick={handleResetClick}>
              Reset
            </Link>
            <Link to="#" className="btn btn-primary" onClick={handleApplyClick}>
              Apply
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableFilter;
