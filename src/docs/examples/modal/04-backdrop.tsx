import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

const backdrops = ["opaque", "blur", "transparent"] as const;

export default function ModalBackdrop() {
  const [backdrop, setBackdrop] = useState<(typeof backdrops)[number] | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {backdrops.map((b) => (
        <Button key={b} variant="tertiary" className="capitalize" onClick={() => setBackdrop(b)}>
          {b}
        </Button>
      ))}
      <Modal isOpen={backdrop !== null} onClose={() => setBackdrop(null)} backdrop={backdrop ?? "opaque"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>backdrop="{backdrop}"</ModalHeader>
              <ModalBody>
                <p>Backdrop: dimmed (opaque), blurred (blur) or clear (transparent).</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
