import { Accordion, AccordionItem } from "nr-ui-kit";
import { CreditCard, Shield, User } from "lucide-react";

const items = [
  { key: "account", icon: <User size={18} />, title: "Account", subtitle: "Name, email and avatar", text: "You can update your profile details at any time." },
  { key: "security", icon: <Shield size={18} />, title: "Security", subtitle: "Password and two-factor authentication", text: "With 2FA on, a code is sent to your phone every time you sign in." },
  { key: "billing", icon: <CreditCard size={18} />, title: "Billing", subtitle: "Plan and invoices", text: "Current plan: Pro. Next payment — November 28." },
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
