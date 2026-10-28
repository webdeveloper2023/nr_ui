import { PhoneInput } from "nr-ui-kit";

// Tanlash ro'yxatini faqat kerakli davlatlar bilan cheklash
export default function PhoneInputCentralAsia() {
  return (
    <div className="max-w-sm">
      <PhoneInput
        label="Markaziy Osiyo"
        country="UZ"
        isCountrySelectable
        countries={["UZ", "KZ", "KG", "TJ", "TM", "AF", "RU"]}
      />
    </div>
  );
}
