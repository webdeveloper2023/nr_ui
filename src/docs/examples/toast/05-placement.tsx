import { Button, useToast } from "nr-ui-kit";

// Placement is set once at the app level:
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
          addToast({ title: "Placement", description: "This docs site uses bottom-right.", color: "accent" })
        }
      >
        Try it
      </Button>
    </div>
  );
}
