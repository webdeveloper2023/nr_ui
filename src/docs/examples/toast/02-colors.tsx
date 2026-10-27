import { Button, useToast } from "nr-ui-kit";

const items = [
  { color: "default", title: "Eslatma", description: "Uchrashuv 15 daqiqadan keyin." },
  { color: "accent", title: "Yangilanish", description: "Yangi versiya mavjud." },
  { color: "success", title: "To'lov qabul qilindi", description: "$29 — Pro tarif." },
  { color: "warning", title: "Diqqat", description: "Xotira 90% to'ldi." },
  { color: "danger", title: "Xatolik", description: "Server bilan aloqa yo'q." },
] as const;

export default function ToastColors() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <Button key={item.color} variant="tertiary" className="capitalize" onClick={() => addToast(item)}>
          {item.color}
        </Button>
      ))}
    </div>
  );
}
