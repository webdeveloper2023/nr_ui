import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

const paragraphs = Array.from({ length: 14 }, (_, i) => `${i + 1}. Foydalanish shartlari bandi: xizmatdan foydalanish orqali siz ushbu qoidalarga rozilik bildirasiz. Ma'lumotlaringiz maxfiylik siyosatiga muvofiq qayta ishlanadi.`);

export default function ModalScrollBehavior() {
  const [mode, setMode] = useState<"inside" | "outside" | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="tertiary" onClick={() => setMode("inside")}>
        Scroll: inside
      </Button>
      <Button variant="tertiary" onClick={() => setMode("outside")}>
        Scroll: outside
      </Button>
      <Modal isOpen={mode !== null} onClose={() => setMode(null)} scrollBehavior={mode ?? "inside"} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Foydalanish shartlari</ModalHeader>
              <ModalBody>
                {paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>
                  Rad etish
                </Button>
                <Button onClick={onClose}>Qabul qilaman</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
