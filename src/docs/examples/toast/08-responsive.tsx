import { Button, ToastProvider, useToast } from "nr-ui-kit";

function ShowToast() {
  const { addToast } = useToast();
  return (
    <Button variant="tertiary" onClick={() => addToast({ title: "Message sent", description: "Aziza will get it in a moment." })}>
      Show toast
    </Button>
  );
}

// Resize the window: on mobile toasts span the full width at the bottom, whatever the placement.
export default function ToastResponsive() {
  return (
    <ToastProvider responsive placement="top-right">
      <div className="flex justify-center">
        <ShowToast />
      </div>
    </ToastProvider>
  );
}
