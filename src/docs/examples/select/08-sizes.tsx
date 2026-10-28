import { Select } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg"] as const;
const cities = [
  { key: "tas", label: "Toshkent" },
  { key: "sam", label: "Samarqand" },
  { key: "bux", label: "Buxoro" },
];

export default function SelectSizes() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      {sizes.map((size) => (
        <Select key={size} size={size} label={`size="${size}"`} items={cities} defaultSelectedKey="tas" />
      ))}
    </div>
  );
}
