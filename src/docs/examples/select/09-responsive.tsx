import { Select } from "nr-ui-kit";

const cities = [
  { key: "tas", label: "Tashkent" },
  { key: "sam", label: "Samarkand" },
  { key: "bux", label: "Bukhara" },
];

export default function SelectResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* Touch-sized trigger and options on mobile and tablet */}
      <Select label="City" items={cities} responsive />
      {/* Mobile only: the left label moves on top */}
      <Select label="Region" labelPlacement="outside-left" items={cities} responsive={["m"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
