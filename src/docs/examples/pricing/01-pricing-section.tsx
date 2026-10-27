import { useState } from "react";
import { Building2, Rocket, Sparkles } from "lucide-react";
import { BillingToggle, PricingCard, useToast, type BillingPeriod } from "nr-ui-kit";

export default function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const { addToast } = useToast();
  const choose = (plan: string) => addToast({ title: `${plan} tanlandi`, color: "success" });

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Oddiy va shaffof narxlar</h2>
        <p className="mt-2 text-sm text-muted">Istalgan vaqtda tarifni o'zgartirishingiz mumkin.</p>
        <BillingToggle className="mt-6" value={period} onChange={setPeriod} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <PricingCard
          name="Starter"
          description="Shaxsiy loyihalar uchun"
          icon={<Sparkles />}
          price={{ monthly: 0, yearly: 0 }}
          period={period}
          ctaLabel="Bepul boshlash"
          features={["3 ta loyiha", "1 GB xotira", { label: "Analitika", included: false }, { label: "Prioritet yordam", included: false }]}
          onSelect={() => choose("Starter")}
        />
        <PricingCard
          name="Pro"
          description="O'sayotgan jamoalar uchun"
          icon={<Rocket />}
          price={{ monthly: 29, yearly: 279 }}
          period={period}
          isPopular
          features={["Cheksiz loyiha", "100 GB xotira", "Analitika", "Prioritet yordam"]}
          onSelect={() => choose("Pro")}
        />
        <PricingCard
          name="Enterprise"
          description="Katta kompaniyalar uchun"
          icon={<Building2 />}
          price="Custom"
          period={period}
          ctaLabel="Bog'lanish"
          features={["SSO va SAML", "SLA 99.99%", "Shaxsiy menejer", "On-premise"]}
          onSelect={() => choose("Enterprise")}
        />
      </div>
    </div>
  );
}
