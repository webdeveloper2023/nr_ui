import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";

type Material = "frosted" | "liquid";

export default function ModalLiquidGlass() {
  const [isOpen, setIsOpen] = useState(false);
  const [material, setMaterial] = useState<Material>("liquid");
  const open = (m: Material) => {
    setMaterial(m);
    setIsOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl px-8 py-14">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative flex flex-wrap justify-center gap-3">
        <Button variant="glass" material="frosted" onClick={() => open("frosted")}>Frosted modal</Button>
        <Button variant="glass" material="liquid" onClick={() => open("liquid")}>Liquid modal</Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} backdrop="transparent" material={material} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{material === "liquid" ? "Liquid" : "Frosted"}</ModalHeader>
              <ModalBody>
                <p className="text-sm text-foreground/75">
                  {material === "liquid"
                    ? "clear glass sheet: shaffof, chetlarida yorug'lik aksi."
                    : "Klassik xira shisha — kuchli blur, oq tus."}
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
