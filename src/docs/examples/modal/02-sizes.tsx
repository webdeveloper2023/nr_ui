import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;

export default function ModalSizes() {
  const [size, setSize] = useState<(typeof sizes)[number] | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {sizes.map((s) => (
        <Button key={s} variant="tertiary" onClick={() => setSize(s)}>
          {s}
        </Button>
      ))}
      <Modal isOpen={size !== null} onClose={() => setSize(null)} size={size ?? "md"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>size="{size}"</ModalHeader>
              <ModalBody>
                <p>Modal kengligi size prop orqali boshqariladi: xs dan 5xl gacha va full.</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Yopish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
