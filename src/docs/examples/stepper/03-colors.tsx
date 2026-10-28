import { Stepper } from "nr-ui-kit";

const steps = [{ title: "Start" }, { title: "In progress" }, { title: "Review" }, { title: "Finish" }];

export default function StepperColors() {
  return (
    <div className="w-full space-y-8">
      {(["accent", "default", "success", "warning", "danger"] as const).map((color) => (
        <Stepper key={color} color={color} steps={steps} currentStep={2} />
      ))}
    </div>
  );
}
