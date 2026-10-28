import { PhoneInput } from "nr-ui-kit";

// Limit the picker to the countries you need
export default function PhoneInputCentralAsia() {
  return (
    <div className="max-w-sm">
      <PhoneInput
        label="Central Asia"
        country="UZ"
        isCountrySelectable
        countries={["UZ", "KZ", "KG", "TJ", "TM", "AF", "RU"]}
      />
    </div>
  );
}
