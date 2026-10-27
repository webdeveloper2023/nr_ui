import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

export default function ModalBasic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setIsOpen(true)}>Modalni ochish</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Jamoaga taklif qilish</ModalHeader>
              <ModalBody>
                <p>Yangi a'zo loyihadagi barcha fayllar va muhokamalarni ko'ra oladi. Ruxsatlarni keyinroq sozlamalarda o'zgartirish mumkin.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>
                  Bekor qilish
                </Button>
                <Button onClick={onClose}>Taklif yuborish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
