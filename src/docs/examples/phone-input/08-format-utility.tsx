import { formatPhone } from "nr-ui-kit";

// Ma'lumotlar bazasidagi E.164 raqamlarni chiroyli ko'rsatish
const contacts = [
  { name: "Ali Valiyev", phone: "+998901234567", country: "UZ" },
  { name: "Aigerim", phone: "+77011234567", country: "KZ" },
  { name: "John Smith", phone: "+12025550143", country: "US" },
  { name: "Mehmet", phone: "+905321234567", country: "TR" },
];

export default function PhoneFormatUtility() {
  return (
    <ul className="max-w-sm divide-y divide-separator rounded-2xl bg-surface-gradient shadow-surface">
      {contacts.map((c) => (
        <li key={c.phone} className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-medium text-foreground">{c.name}</span>
          <span className="tabular-nums text-muted">{formatPhone(c.phone, c.country)}</span>
        </li>
      ))}
    </ul>
  );
}
