import { Stepper } from "nr-ui-kit";

export default function StepperVertical() {
  return (
    <Stepper
      orientation="vertical"
      currentStep={2}
      className="mx-auto max-w-xs"
      steps={[
        { title: "Order placed", description: "Oct 27, 09:12" },
        { title: "Payment confirmed", description: "Oct 27, 09:14" },
        { title: "Out for delivery", description: "The courier is on the way" },
        { title: "Delivered" },
      ]}
    />
  );
}
