import { useState } from "react";
import { PhoneInput, getPhoneCountry } from "nr-ui-kit";

export default function PhoneInputCountrySelect() {
  const [country, setCountry] = useState("UZ");
  const info = getPhoneCountry(country);

  return (
    <div className="max-w-sm space-y-3">
      <PhoneInput
        label="Telefon"
        country={country}
        onCountryChange={setCountry}
        isCountrySelectable
        description="Bayroqni bosib davlatni tanlang yoki +7… kabi raqamni paste qiling"
      />
      <p className="text-sm text-muted">
        Tanlangan: <b className="text-foreground">{info?.name}</b> (+{info?.dial})
      </p>
    </div>
  );
}
