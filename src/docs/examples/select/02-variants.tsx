import { Select } from "nr-ui-kit";

const cities = [
  { key: "tas", label: "Tashkent" },
  { key: "sam", label: "Samarkand" },
  { key: "bux", label: "Bukhara" },
  { key: "and", label: "Andijan" },
];

export default function SelectVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center">
        <Select variant="primary" label="Primary" items={cities} placeholder="Select a city" />
      </div>
      <div className="rounded-3xl bg-surface p-5 shadow-surface">
        <Select variant="secondary" label="Secondary" items={cities} placeholder="Select a city" />
      </div>
    </div>
  );
}
