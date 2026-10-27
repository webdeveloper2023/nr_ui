import { Button, useToast } from "nr-ui-kit";

// Joylashuv ilova darajasida beriladi:
//
//   <ToastProvider placement="top-center" maxVisible={3}>
//     <App />
//   </ToastProvider>
//
// placement: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
export default function ToastPlacement() {
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Button
        variant="secondary"
        onClick={() =>
          addToast({ title: "Joylashuv", description: "Bu docs saytida bottom-right ishlatilgan.", color: "accent" })
        }
      >
        Sinab ko'rish
      </Button>
    </div>
  );
}
