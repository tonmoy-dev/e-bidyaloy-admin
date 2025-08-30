export default function DeleteConfirmationModal({
  onDeleteConfirm,
  onDeleteCancel,
}: {
  onDeleteConfirm?: () => void;
  onDeleteCancel?: () => void;
}) {
  return (
    <div className="modal fade" id="delete-modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center">
            <span className="delete-icon">
              <i className="ti ti-trash-x" />
            </span>
            <h4>Confirm Deletion</h4>
            <p>You want to delete all the marked items, this cant be undone once you delete.</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={onDeleteCancel}
                className="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button onClick={onDeleteConfirm} className="btn btn-danger" data-bs-dismiss="modal">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
