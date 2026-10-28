import { useState } from "react";
import { Button, Stepper } from "nr-ui-kit";

const steps = [
  { title: "Account", description: "Email and password" },
  { title: "Profile", description: "Personal details" },
  { title: "Plan", description: "Choose a plan" },
  { title: "Done", description: "Confirm" },
];

export default function StepperBasic() {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} />
      <div className="mt-8 flex justify-center gap-2">
        <Button variant="tertiary" isDisabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button isDisabled={step === steps.length} onClick={() => setStep(step + 1)}>
          {step >= steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
