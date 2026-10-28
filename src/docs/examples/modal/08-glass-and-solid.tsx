import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

export default function ModalGlassAndSolid() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"glass" | "solid">("glass");
  const open = (m: "glass" | "solid") => {
    setMode(m);
    setIsOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl px-8 py-14">
      <div className="absolute left-6 top-4 size-48 rounded-full bg-blue blur-2xl opacity-70" />
      <div className="absolute right-6 top-6 size-56 rounded-full bg-pink blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-48 rounded-full bg-mint blur-2xl opacity-60" />
      <div className="relative flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={() => open("glass")}>Glass modal</Button>
        <Button variant="secondary" onClick={() => open("solid")}>Solid modal</Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} backdrop="blur" isBlurred={mode === "glass"} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{mode === "solid" ? "To'q oyna" : "Shisha oyna"}</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted">
                  {mode === "solid"
                    ? "isBlurred={false} — oddiy to'q fon."
                    : "Oyna orqasidagi sahifa xira ko'rinadi — Vivid sheet uslubi."}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>Bekor qilish</Button>
                <Button onClick={onClose}>Davom etish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
