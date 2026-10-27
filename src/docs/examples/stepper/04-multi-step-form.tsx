import { useState } from "react";
import { Button, Input, Stepper } from "nr-ui-kit";

const steps = [{ title: "Kontakt" }, { title: "Manzil" }, { title: "Tasdiqlash" }];

export default function StepperMultiStepForm() {
  const [step, setStep] = useState(0);
  const done = step === steps.length;

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-surface p-6 shadow-surface">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} />
      <div className="mt-8 space-y-3">
        {step === 0 && (
          <>
            <Input variant="secondary" label="Ism" placeholder="Rafiqjon" />
            <Input variant="secondary" label="Email" type="email" placeholder="you@example.com" />
          </>
        )}
        {step === 1 && (
          <>
            <Input variant="secondary" label="Shahar" placeholder="Toshkent" />
            <Input variant="secondary" label="Ko'cha" placeholder="Amir Temur 1" />
          </>
        )}
        {step === 2 && <p className="text-sm text-muted">Ma'lumotlar to'g'ri bo'lsa, "Yuborish" tugmasini bosing.</p>}
        {done && <p className="text-sm font-medium text-success-soft-foreground">Muvaffaqiyatli yuborildi!</p>}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="tertiary" isDisabled={step === 0} onClick={() => setStep(step - 1)}>Orqaga</Button>
        <Button isDisabled={done} onClick={() => setStep(step + 1)}>{step === steps.length - 1 ? "Yuborish" : "Keyingi"}</Button>
      </div>
    </div>
  );
}
