interface DataModalProps {
  modalId: string;
  modalTitle: string;
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
}

export default function DataModal({ modalId, modalTitle, header, footer, body }: DataModalProps) {
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
          <div className="modal-body">{body}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
}
