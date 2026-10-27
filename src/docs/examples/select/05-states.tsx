import { Select } from "nr-ui-kit";

const sizes = [
  { key: "s", label: "S" },
  { key: "m", label: "M" },
  { key: "l", label: "L" },
  { key: "xl", label: "XL", isDisabled: true },
];

export default function SelectStates() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <Select label="Majburiy" isRequired items={sizes} description="XL hozircha yo'q" />
      <Select label="Xato" isInvalid errorMessage="O'lchamni tanlang" items={sizes} />
      <Select label="O'chirilgan" isDisabled items={sizes} defaultSelectedKey="m" />
    </div>
  );
}
