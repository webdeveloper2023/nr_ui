import { Stepper } from "nr-ui-kit";

const steps = [{ title: "Boshlash" }, { title: "Jarayon" }, { title: "Tekshiruv" }, { title: "Tugash" }];

export default function StepperColors() {
  return (
    <div className="w-full space-y-8">
      {(["accent", "default", "success", "warning", "danger"] as const).map((color) => (
        <Stepper key={color} color={color} steps={steps} currentStep={2} />
      ))}
    </div>
  );
}
