import { PhoneInput } from "nr-ui-kit";

export default function PhoneInputBasic() {
  return (
    <div className="max-w-sm">
      <PhoneInput country="UZ" label="Phone number" description="For example: 90 123 45 67" />
    </div>
  );
}
