import { useState } from "react";
import { Button, Stepper } from "nr-ui-kit";

const steps = [
  { title: "Hisob", description: "Email va parol" },
  { title: "Profil", description: "Shaxsiy ma'lumot" },
  { title: "Tarif", description: "Rejani tanlang" },
  { title: "Tayyor", description: "Tasdiqlash" },
];

export default function StepperBasic() {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} />
      <div className="mt-8 flex justify-center gap-2">
        <Button variant="tertiary" isDisabled={step === 0} onClick={() => setStep(step - 1)}>Orqaga</Button>
        <Button isDisabled={step === steps.length} onClick={() => setStep(step + 1)}>
          {step >= steps.length - 1 ? "Yakunlash" : "Keyingi"}
        </Button>
      </div>
    </div>
  );
}
