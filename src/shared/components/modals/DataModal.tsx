interface DataModalProps {
  modalId: string;
  modalTitle: string;
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
  handleModalFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function DataModal({
  modalId,
  modalTitle,
  handleModalFormSubmit = (event) => event.preventDefault(),
  header,
  footer,
  body,
}: DataModalProps) {
  return (
    <div className="modal fade" id={modalId}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <h4 className="modal-title">{modalTitle}</h4>
              {header}
            </div>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleModalFormSubmit}>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">{footer}</div>
          </form>
        </div>
      </div>
    </div>
  );
}
