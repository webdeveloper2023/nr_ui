import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

// Resize the window: a bottom sheet with stacked buttons on mobile, a centered dialog from tablet up.
export default function ModalResponsive() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setIsOpen(true)}>Open responsive modal</Button>
      <Modal responsive placement="center" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete this project?</ModalHeader>
              <ModalBody>
                <p>All files, comments and shared links of "Q3 report" will be removed. This cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" responsive onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="danger" responsive onClick={onClose}>
                  Delete project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
