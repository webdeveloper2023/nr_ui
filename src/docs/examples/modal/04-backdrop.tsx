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
                <p>Orqa fon: to'q (opaque), xiralashgan (blur) yoki shaffof (transparent).</p>
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
