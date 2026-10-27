import { Select } from "nr-ui-kit";

const animals = [
  { key: "cat", label: "Mushuk" },
  { key: "dog", label: "It" },
  { key: "parrot", label: "To'tiqush" },
  { key: "rabbit", label: "Quyon" },
  { key: "turtle", label: "Toshbaqa" },
];

export default function SelectBasic() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Select label="Sevimli hayvon" placeholder="Tanlang" items={animals} />
    </div>
  );
}
