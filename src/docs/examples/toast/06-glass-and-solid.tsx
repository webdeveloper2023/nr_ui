import { Button, useToast } from "nr-ui-kit";

// Global setting for all toasts: <ToastProvider isBlurred={false}> — every toast gets a solid background.
export default function ToastGlassAndSolid() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="secondary"
        onClick={() => addToast({ title: "Glass toast", description: "The content behind is blurred.", color: "accent" })}
      >
        Glass (default)
      </Button>
      <Button
        variant="secondary"
        onClick={() => addToast({ title: "Solid toast", description: "Solid background, no blur.", color: "success", isBlurred: false })}
      >
        Solid
      </Button>
    </div>
  );
}
