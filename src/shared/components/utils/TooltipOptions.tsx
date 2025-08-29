import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type ExportOption = {
  label: string;
  icon: string;
  onClick: () => void;
};
type PrintOption = {
  label: string;
  icon: string;
  onClick: () => void;
};

interface TooltipOptionProps {
  showPrint?: boolean;
  printLabel?: string;
  onPrintClick?: () => void;
  showExport?: boolean;
  exportOptionsLabel?: string;
  exportOptions?: ExportOption[];
  printOption?: PrintOption;
}

const TooltipOptions = ({
  printOption = { label: 'Print', icon: 'ti ti-printer', onClick: () => {} },
  showPrint = false,
  showExport = false,
  exportOptionsLabel = 'Export',
  exportOptions = [
    {
      label: 'Export as PDF',
      icon: 'ti ti-file-type-pdf',
      onClick: () => {},
    },
    {
      label: 'Export as Excel',
      icon: 'ti ti-file-type-xls',
      onClick: () => {},
    },
  ], // // [{ label: "Export as PDF", icon: "ti ti-file-type-pdf", onClick: fn }]
}: TooltipOptionProps) => {
  return (
    <>
      {/* Print */}
      {showPrint && printOption?.label && printOption?.icon && (
        <div className="pe-1 mb-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-top">{printOption?.label}</Tooltip>}
          >
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-icon me-1"
              onClick={printOption?.onClick}
            >
              <i className={printOption?.icon} />
            </button>
          </OverlayTrigger>
        </div>
      )}
      {/* Export dropdown */}
      {showExport && exportOptions.length > 0 && (
        <div className="dropdown me-2 mb-2">
          <Link
            to="#"
            className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <i className="ti ti-file-export me-2" />
            {exportOptionsLabel}
          </Link>
          <ul className="dropdown-menu  dropdown-menu-end p-3">
            {exportOptions.map((option, index) => (
              <li key={index}>
                <button onClick={option.onClick} className="dropdown-item rounded-1">
                  <i className={`${option.icon} me-2`} />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TooltipOptions;
