import { useState } from "react";
import { Button, Input, Stepper } from "nr-ui-kit";

const steps = [{ title: "Contact" }, { title: "Address" }, { title: "Confirm" }];

export default function StepperMultiStepForm() {
  const [step, setStep] = useState(0);
  const done = step === steps.length;

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-surface p-6 shadow-surface">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} />
      <div className="mt-8 space-y-3">
        {step === 0 && (
          <>
            <Input variant="secondary" label="Name" placeholder="Rafiqjon" />
            <Input variant="secondary" label="Email" type="email" placeholder="you@example.com" />
          </>
        )}
        {step === 1 && (
          <>
            <Input variant="secondary" label="City" placeholder="Tashkent" />
            <Input variant="secondary" label="Street" placeholder="1 Amir Temur St" />
          </>
        )}
        {step === 2 && <p className="text-sm text-muted">If everything looks right, click "Submit".</p>}
        {done && <p className="text-sm font-medium text-success-soft-foreground">Submitted successfully!</p>}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="tertiary" isDisabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button isDisabled={done} onClick={() => setStep(step + 1)}>{step === steps.length - 1 ? "Submit" : "Next"}</Button>
      </div>
    </div>
  );
}
