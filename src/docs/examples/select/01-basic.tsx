import { Select } from "nr-ui-kit";

const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "parrot", label: "Parrot" },
  { key: "rabbit", label: "Rabbit" },
  { key: "turtle", label: "Turtle" },
];

export default function SelectBasic() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Select label="Favorite animal" placeholder="Select" items={animals} />
    </div>
  );
}
