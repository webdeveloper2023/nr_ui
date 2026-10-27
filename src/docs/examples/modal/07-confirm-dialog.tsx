import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";
import { Trash2 } from "lucide-react";

// isDismissable={false} — tashqariga bosib yoki Escape bilan yopib bo'lmaydi.
export default function ModalConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button variant="danger-soft" startContent={<Trash2 size={16} />} onClick={() => setIsOpen(true)}>
        Loyihani o'chirish
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm" isDismissable={false} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger">
                  <Trash2 size={18} />
                </span>
                Loyihani o'chirasizmi?
              </ModalHeader>
              <ModalBody>
                <p>"Acme Dashboard" va undagi 128 ta fayl butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>
                  Bekor qilish
                </Button>
                <Button variant="danger" onClick={onClose}>
                  O'chirish
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
