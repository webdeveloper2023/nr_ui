import { Input } from "nr-ui-kit";

// Mark required fields with an asterisk or the word "Required"; mark the rest "Optional".
export default function RequiredAndOptional() {
  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
      <Input label="Company" isRequired />
      <Input label="Website" isOptional />
      <Input label="Company" isRequired necessityIndicator="text" />
      <Input label="Website" isOptional necessityIndicator="text" />
    </div>
  );
}
