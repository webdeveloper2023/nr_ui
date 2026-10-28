import { useState } from "react";
import { PhoneInput, getPhoneCountry } from "nr-ui-kit";

export default function PhoneInputCountrySelect() {
  const [country, setCountry] = useState("UZ");
  const info = getPhoneCountry(country);

  return (
    <div className="max-w-sm space-y-3">
      <PhoneInput
        label="Phone"
        country={country}
        onCountryChange={setCountry}
        isCountrySelectable
        description="Click the flag to pick a country, or paste a number like +7…"
      />
      <p className="text-sm text-muted">
        Selected: <b className="text-foreground">{info?.name}</b> (+{info?.dial})
      </p>
    </div>
  );
}
