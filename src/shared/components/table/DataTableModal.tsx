import { Button, Modal } from 'react-bootstrap';

export type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

interface DataModalProps {
  show: boolean;
  onClose: () => void;
  modalTitle: string;
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode; // optional footer
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const SIZE_MAP: Record<string, string> = {
  sm: 'modal-sm',
  md: 'modal-md',
  lg: 'modal-lg',
  xl: 'modal-xl',
};

export default function DataTableModal({
  show,
  onClose,
  modalTitle,
  header,
  body,
  footer,
  size = 'md',
  centered = true,
}: DataModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered={centered} dialogClassName={SIZE_MAP[size]}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
        {header}
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        {footer ? (
          footer
        ) : (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
