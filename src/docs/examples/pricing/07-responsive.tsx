import { useState } from "react";
import { BillingToggle, PricingCard, type BillingPeriod } from "nr-ui-kit";

// Resize the window: on mobile the toggle and the cards fill the width; on desktop the cards get roomier.
export default function PricingResponsive() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div className="flex flex-col items-center gap-6">
      <BillingToggle responsive value={period} onChange={setPeriod} />
      <div className="grid w-full gap-4 md:grid-cols-2">
        <PricingCard responsive name="Starter" price={{ monthly: 9, yearly: 86 }} period={period} features={["3 projects", "Email support"]} />
        <PricingCard
          responsive
          isPopular
          name="Pro"
          price={{ monthly: 29, yearly: 278 }}
          period={period}
          features={["Unlimited projects", "Priority support", "Analytics"]}
        />
      </div>
    </div>
  );
}
