import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

export default function ModalBasic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Invite to team</ModalHeader>
              <ModalBody>
                <p>The new member will see all files and discussions in this project. You can change permissions later in settings.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>Send invite</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
