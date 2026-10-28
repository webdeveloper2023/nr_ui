import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

const placements = ["auto", "center", "top", "bottom"] as const;

// "auto" — a bottom sheet on mobile, centered on larger screens.
export default function ModalPlacement() {
  const [placement, setPlacement] = useState<(typeof placements)[number] | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {placements.map((p) => (
        <Button key={p} variant="tertiary" onClick={() => setPlacement(p)}>
          {p}
        </Button>
      ))}
      <Modal isOpen={placement !== null} onClose={() => setPlacement(null)} placement={placement ?? "auto"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>placement="{placement}"</ModalHeader>
              <ModalBody>
                <p>Choose where on the screen the modal appears.</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Got it</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
