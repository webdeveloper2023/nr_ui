import { Alert } from "nr-ui-kit";

const items = [
  { color: "default", title: "Eslatma", description: "Profilingiz 80% to'ldirilgan." },
  { color: "accent", title: "Ma'lumot", description: "Yakshanba kuni 02:00 da texnik ishlar o'tkaziladi." },
  { color: "success", title: "Saqlandi", description: "Barcha o'zgarishlar muvaffaqiyatli saqlandi." },
  { color: "warning", title: "Diqqat", description: "Xotiraning 90% qismi band." },
  { color: "danger", title: "Xatolik", description: "To'lovni amalga oshirib bo'lmadi. Kartani tekshiring." },
] as const;

export default function AlertColors() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      {items.map((item) => (
        <Alert key={item.color} color={item.color} title={item.title} description={item.description} />
      ))}
    </div>
  );
}
