import { PhoneInput } from "nr-ui-kit";

export default function PhoneInputSizes() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <PhoneInput country="UZ" size="xs" label="Extra small" />
      <PhoneInput country="UZ" size="sm" label="Small" />
      <PhoneInput country="UZ" size="lg" label="Large" radius="full" />
      <PhoneInput country="UZ" variant="secondary" label="Secondary" />
      <PhoneInput country="UZ" flag="code" label='flag="code"' placeholderChar="-" />
    </div>
  );
}
