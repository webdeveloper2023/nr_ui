import { Crown } from "lucide-react";
import { PricingCard } from "nr-ui-kit";

export default function PricingInverseCard() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <PricingCard
        name="Team"
        price={{ monthly: 49, yearly: 470 }}
        period="monthly"
        featuresTitle="Everything in Pro, plus:"
        features={["10 members", "Shared workspace", "Audit log"]}
      />
      <PricingCard
        variant="inverse"
        isPopular
        popularLabel="Recommended"
        name="Business"
        icon={<Crown />}
        price={{ monthly: 99, yearly: 950 }}
        period="monthly"
        featuresTitle="Everything in Team, plus:"
        features={["Unlimited members", "SSO", "24/7 support"]}
      />
    </div>
  );
}
