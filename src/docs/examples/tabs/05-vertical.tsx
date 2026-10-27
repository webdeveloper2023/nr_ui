import { Tabs } from "nr-ui-kit";

const content: Record<string, { title: string; text: string }> = {
  account: { title: "Hisob sozlamalari", text: "Hisob ma'lumotlari va afzalliklaringizni boshqaring." },
  security: { title: "Xavfsizlik", text: "Parol, ikki bosqichli autentifikatsiya va sessiyalar." },
  notifications: { title: "Bildirishnomalar", text: "Qaysi xabarlarni olishni tanlang." },
  billing: { title: "To'lovlar", text: "Tarif, hisob-fakturalar va to'lov usullari." },
};

export default function TabsVertical() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Tabs
        isVertical
        tabs={[
          { key: "account", title: "Hisob" },
          { key: "security", title: "Xavfsizlik" },
          { key: "notifications", title: "Bildirishnomalar" },
          { key: "billing", title: "To'lovlar" },
        ]}
      >
        {(key) => (
          <div className="pt-1">
            <p className="font-medium text-foreground">{content[key].title}</p>
            <p className="mt-1 text-muted">{content[key].text}</p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
