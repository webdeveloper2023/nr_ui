import { PhoneInput } from "nr-ui-kit";

export default function PhoneInputResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* 44px field with 16px text on mobile; the country picker is easy to tap */}
      <PhoneInput label="Phone" isCountrySelectable responsive />
      {/* Mobile only */}
      <PhoneInput label="Work phone" responsive={["m"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
