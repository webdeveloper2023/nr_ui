import { PhoneInput } from "nr-ui-kit";

// country — ISO code: 2 letters ("UZ") or 3 letters ("UZB"), case-insensitive
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
