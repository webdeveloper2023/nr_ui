import { useState } from "react";
import { BillingToggle, type BillingPeriod } from "nr-ui-kit";

export default function PricingBillingToggle() {
  const [period, setPeriod] = useState<BillingPeriod>("yearly");

  return (
    <div className="flex flex-col items-center gap-4">
      <BillingToggle value={period} onChange={setPeriod} />
      <BillingToggle value={period} onChange={setPeriod} yearlyBadge="2 oy bepul" labels={{ monthly: "Oylik", yearly: "Yillik" }} />
      <p className="text-sm text-muted">Tanlangan: {period}</p>
    </div>
  );
}
