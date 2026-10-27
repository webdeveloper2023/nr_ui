import { Accordion, AccordionItem } from "nr-ui-kit";
import { CreditCard, Shield, User } from "lucide-react";

const items = [
  { key: "account", icon: <User size={18} />, title: "Hisob", subtitle: "Ism, email va avatar", text: "Profil ma'lumotlarini istalgan vaqtda yangilashingiz mumkin." },
  { key: "security", icon: <Shield size={18} />, title: "Xavfsizlik", subtitle: "Parol va ikki bosqichli himoya", text: "2FA yoqilsa, har kirishda telefoningizga kod yuboriladi." },
  { key: "billing", icon: <CreditCard size={18} />, title: "To'lovlar", subtitle: "Tarif va hisob-fakturalar", text: "Joriy tarif: Pro. Keyingi to'lov — 28-noyabr." },
];

export default function AccordionWithSubtitleIcons() {
  return (
    <div className="mx-auto max-w-xl">
      <Accordion variant="surface">
        {items.map((item) => (
          <AccordionItem
            key={item.key}
            itemKey={item.key}
            title={item.title}
            subtitle={item.subtitle}
            startContent={
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-default text-foreground">{item.icon}</span>
            }
          >
            {item.text}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
