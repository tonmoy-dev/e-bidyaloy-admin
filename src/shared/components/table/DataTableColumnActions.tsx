export default function DataTableColumnActions({
  viewActionId,
  editActionId,
}: {
  viewActionId?: string;
  editActionId?: string;
}) {
  return (
    <div className="d-flex align-items-center">
      <div className="dropdown">
        <button
          className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="ti ti-dots-vertical fs-14" />
        </button>
        <ul className="dropdown-menu dropdown-menu-right p-3">
          <li>
            <button
              className="dropdown-item rounded-1"
              data-bs-toggle="modal"
              data-bs-target={`#${viewActionId}`}
            >
              <i className="ti ti-eye me-2" />
              View
            </button>
          </li>
          <li>
            <button
              className="dropdown-item rounded-1"
              data-bs-toggle="modal"
              data-bs-target={`#${editActionId}`}
            >
              <i className="ti ti-edit-circle me-2" />
              Edit
            </button>
          </li>
          <li>
            <button
              className="dropdown-item rounded-1"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
            >
              <i className="ti ti-trash-x me-2" />
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
