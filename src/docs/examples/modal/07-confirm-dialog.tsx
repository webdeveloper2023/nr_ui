import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";
import { Trash2 } from "lucide-react";

// isDismissable={false} — can't be closed by clicking outside or pressing Escape.
export default function ModalConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button variant="danger-soft" startContent={<Trash2 size={16} />} onClick={() => setIsOpen(true)}>
        Delete project
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm" isDismissable={false} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger">
                  <Trash2 size={18} />
                </span>
                Delete this project?
              </ModalHeader>
              <ModalBody>
                <p>"Acme Dashboard" and its 128 files will be permanently deleted. This action can't be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={onClose}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
