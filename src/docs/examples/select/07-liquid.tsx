import { Select } from "nr-ui-kit";

const cities = [
  { key: "tashkent", label: "Toshkent" },
  { key: "samarkand", label: "Samarqand" },
  { key: "bukhara", label: "Buxoro" },
  { key: "khiva", label: "Xiva" },
];

export default function SelectLiquidGlass() {
  return (
    <div className="relative h-80 overflow-hidden rounded-3xl p-8">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative grid gap-4 sm:grid-cols-2">
        <Select label="Frosted" items={cities} defaultSelectedKey="tashkent" material="frosted" />
        <Select label="Liquid" items={cities} defaultSelectedKey="samarkand" material="liquid" />
      </div>
    </div>
  );
}
