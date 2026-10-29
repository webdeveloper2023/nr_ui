import { useState } from "react";
import { Button, Stepper } from "nr-ui-kit";

const steps = [
  { title: "Account", description: "Email and password" },
  { title: "Profile", description: "Name and photo" },
  { title: "Payment", description: "Card details" },
  { title: "Done", description: "Ready to go" },
];

// Resize the window: on mobile only the current step keeps its title, on tablet descriptions hide.
export default function StepperResponsive() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <Stepper responsive steps={steps} currentStep={step} onStepChange={setStep} />
      <div className="flex justify-center gap-2">
        <Button responsive variant="tertiary" isDisabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button responsive isDisabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
