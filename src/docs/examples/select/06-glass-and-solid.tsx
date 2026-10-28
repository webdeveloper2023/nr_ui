import { Select } from "nr-ui-kit";

const cities = [
  { key: "tashkent", label: "Tashkent" },
  { key: "samarkand", label: "Samarkand" },
  { key: "bukhara", label: "Bukhara" },
  { key: "khiva", label: "Khiva" },
  { key: "fergana", label: "Fergana" },
];

export default function SelectGlassAndSolid() {
  return (
    <div className="relative h-80 overflow-hidden rounded-3xl p-8">
      <div className="absolute left-6 top-16 size-56 rounded-full bg-indigo blur-2xl opacity-60" />
      <div className="absolute right-6 top-24 size-56 rounded-full bg-orange blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-48 rounded-full bg-teal blur-2xl opacity-60" />
      <div className="relative grid gap-4 sm:grid-cols-2">
        <Select label="Glass (default)" items={cities} defaultSelectedKey="tashkent" />
        <Select label="Solid" items={cities} defaultSelectedKey="bukhara" isBlurred={false} />
      </div>
    </div>
  );
}
