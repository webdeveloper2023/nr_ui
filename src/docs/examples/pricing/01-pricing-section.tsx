import { useState } from "react";
import { Building2, Rocket, Sparkles } from "lucide-react";
import { BillingToggle, PricingCard, useToast, type BillingPeriod } from "nr-ui-kit";

export default function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const { addToast } = useToast();
  const choose = (plan: string) => addToast({ title: `${plan} selected`, color: "success" });

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Simple, transparent pricing</h2>
        <p className="mt-2 text-sm text-muted">Change your plan at any time.</p>
        <BillingToggle className="mt-6" value={period} onChange={setPeriod} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <PricingCard
          name="Starter"
          description="For personal projects"
          icon={<Sparkles />}
          price={{ monthly: 0, yearly: 0 }}
          period={period}
          ctaLabel="Start for free"
          features={["3 projects", "1 GB storage", { label: "Analytics", included: false }, { label: "Priority support", included: false }]}
          onSelect={() => choose("Starter")}
        />
        <PricingCard
          name="Pro"
          description="For growing teams"
          icon={<Rocket />}
          price={{ monthly: 29, yearly: 279 }}
          period={period}
          isPopular
          features={["Unlimited projects", "100 GB storage", "Analytics", "Priority support"]}
          onSelect={() => choose("Pro")}
        />
        <PricingCard
          name="Enterprise"
          description="For large companies"
          icon={<Building2 />}
          price="Custom"
          period={period}
          ctaLabel="Contact sales"
          features={["SSO and SAML", "SLA 99.99%", "Dedicated manager", "On-premise"]}
          onSelect={() => choose("Enterprise")}
        />
      </div>
    </div>
  );
}
