import { Stepper } from "nr-ui-kit";

export default function StepperVertical() {
  return (
    <Stepper
      orientation="vertical"
      currentStep={2}
      className="mx-auto max-w-xs"
      steps={[
        { title: "Buyurtma berildi", description: "27-oktabr, 09:12" },
        { title: "To'lov tasdiqlandi", description: "27-oktabr, 09:14" },
        { title: "Yetkazilmoqda", description: "Kuryer yo'lda" },
        { title: "Yetkazildi" },
      ]}
    />
  );
}
