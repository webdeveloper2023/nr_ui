import { Alert } from "nr-ui-kit";

export default function AlertGlass() {
  return (
    <div className="relative grid w-full gap-3 overflow-hidden rounded-3xl p-6 sm:p-8">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Alert className="relative" variant="glass" title="Yangilanish tayyor" description="Shisha uslubidagi bildirishnoma." />
      <Alert className="relative" variant="glass" color="success" title="Saqlandi" description="O'zgarishlar bulut bilan sinxronlandi." />
      <Alert className="relative" variant="glass" color="danger" title="Xatolik" description="Tarmoqqa ulanib bo'lmadi." />
    </div>
  );
}
