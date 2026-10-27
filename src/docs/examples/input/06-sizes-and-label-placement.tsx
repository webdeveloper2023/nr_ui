import { Input } from "nr-ui-kit";

export default function InputSizesAndLabelPlacement() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
      <Input label="Telefon" labelPlacement="outside-left" placeholder="+998 90 123 45 67" />
    </div>
  );
}
