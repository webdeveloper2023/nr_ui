import { PhoneInput } from "nr-ui-kit";

// country — ISO qisqartmasi: 2 harfli ("UZ") yoki 3 harfli ("UZB"), katta-kichik harf farqi yo'q
const examples = ["uzb", "KZ", "RUS", "US", "TR", "GB", "DE", "KOR"];

export default function PhoneInputByCountry() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {examples.map((code) => (
        <PhoneInput key={code} country={code} label={`country="${code}"`} />
      ))}
    </div>
  );
}
