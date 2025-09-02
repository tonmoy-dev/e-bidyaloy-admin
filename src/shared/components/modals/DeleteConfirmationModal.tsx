import { Button, Modal } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
}: DeleteConfirmationModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="text-center">
        <span className="delete-icon mb-3 d-block">
          <i className="ti ti-trash-x fs-1 text-danger" />
        </span>
        <h4 className="mb-3">{title}</h4>
        <p>{message}</p>
        <div className="d-flex justify-content-center mt-3">
          <Button variant="light" className="me-3" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
