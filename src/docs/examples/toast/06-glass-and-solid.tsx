import { Button, useToast } from "nr-ui-kit";

// Barcha toastlar uchun global sozlama: <ToastProvider isBlurred={false}> — hammasi to'q fonli bo'ladi.
export default function ToastGlassAndSolid() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="secondary"
        onClick={() => addToast({ title: "Glass toast", description: "Orqadagi kontent xira ko'rinadi.", color: "accent" })}
      >
        Glass (default)
      </Button>
      <Button
        variant="secondary"
        onClick={() => addToast({ title: "Solid toast", description: "To'q fon, blur yo'q.", color: "success", isBlurred: false })}
      >
        Solid
      </Button>
    </div>
  );
}
