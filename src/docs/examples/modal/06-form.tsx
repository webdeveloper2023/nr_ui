import { useState } from "react";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useToast } from "nr-ui-kit";
import { Lock, Mail } from "lucide-react";

export default function ModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Button onClick={() => setIsOpen(true)}>Sign in</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onClose();
                addToast({ title: "Welcome back!", color: "success" });
              }}
            >
              <ModalHeader>
                Sign in
                <span className="text-sm font-normal text-muted">Enter your details to sign in to your account</span>
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input label="Email" type="email" variant="secondary" placeholder="you@example.com" startContent={<Mail size={16} />} />
                <Input label="Password" type="password" variant="secondary" placeholder="••••••••" startContent={<Lock size={16} />} />
                <div className="flex items-center justify-between">
                  <Checkbox size="sm" variant="secondary">Remember me</Checkbox>
                  <a href="#" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" fullWidth>
                  Sign in
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
