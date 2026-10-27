import { Select } from "nr-ui-kit";

const cities = [
  { key: "tas", label: "Toshkent" },
  { key: "sam", label: "Samarqand" },
  { key: "bux", label: "Buxoro" },
  { key: "and", label: "Andijon" },
];

export default function SelectVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center">
        <Select variant="primary" label="Primary" items={cities} placeholder="Shaharni tanlang" />
      </div>
      <div className="rounded-3xl bg-surface p-5 shadow-surface">
        <Select variant="secondary" label="Secondary" items={cities} placeholder="Shaharni tanlang" />
      </div>
    </div>
  );
}
