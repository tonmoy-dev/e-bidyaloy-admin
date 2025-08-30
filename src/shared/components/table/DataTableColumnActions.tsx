import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function DataTableColumnActions({
  showViewAction = true,
  showEditAction = true,
  showDeleteAction = true,
  viewActionId,
  editActionId,
}: {
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  viewActionId?: string;
  editActionId?: string;
}) {
  return (
    <div className="d-flex align-items-center gap-2">
      {showViewAction && viewActionId && (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">View</Tooltip>}>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            data-bs-toggle="modal"
            data-bs-target={`#${viewActionId}`}
          >
            <i className="ti ti-eye" />
          </button>
        </OverlayTrigger>
      )}
      {showEditAction && editActionId && (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Edit</Tooltip>}>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            data-bs-toggle="modal"
            data-bs-target={`#${editActionId}`}
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
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
          >
            <i className="ti ti-trash-x" />
          </button>
        </OverlayTrigger>
      )}
    </div>
  );
}
