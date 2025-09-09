import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function DataTableColumnActions({
  showViewAction = true,
  showEditAction = true,
  showDeleteAction = true,
  onViewButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
}: {
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onViewButtonClick?: () => void;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
}) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      {showViewAction && (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">View</Tooltip>}>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            onClick={onViewButtonClick}
          >
            <i className="ti ti-eye" />
          </button>
        </OverlayTrigger>
      )}
      {showEditAction && (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Edit</Tooltip>}>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            onClick={onEditButtonClick}
          >
            <i className="ti ti-edit-circle" />
          </button>
        </OverlayTrigger>
      )}

      {showDeleteAction && (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Delete</Tooltip>}>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            onClick={onDeleteButtonClick}
          >
            <i className="ti ti-trash-x" />
          </button>
        </OverlayTrigger>
      )}
    </div>
  );
}
