import { Crown } from "lucide-react";
import { PricingCard } from "nr-ui-kit";

export default function PricingInverseCard() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <PricingCard
        name="Team"
        price={{ monthly: 49, yearly: 470 }}
        period="monthly"
        featuresTitle="Hammasi Pro'dagidek, va:"
        features={["10 ta a'zo", "Umumiy ish joyi", "Audit log"]}
      />
      <PricingCard
        variant="inverse"
        isPopular
        popularLabel="Tavsiya"
        name="Business"
        icon={<Crown />}
        price={{ monthly: 99, yearly: 950 }}
        period="monthly"
        featuresTitle="Hammasi Team'dagidek, va:"
        features={["Cheksiz a'zolar", "SSO", "24/7 yordam"]}
      />
    </div>
  );
}
