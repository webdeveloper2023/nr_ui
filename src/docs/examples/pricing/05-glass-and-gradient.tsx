import { Building2, Rocket, Sparkles } from "lucide-react";
import { PricingCard } from "nr-ui-kit";

export default function PricingGlassAndGradient() {
  return (
    <div className="relative grid w-full items-center gap-5 overflow-hidden rounded-3xl p-6 sm:p-8 md:grid-cols-3">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <PricingCard
        className="relative"
        isBlurred
        name="Starter"
        icon={<Sparkles />}
        description="Personal projects"
        price={{ monthly: 0, yearly: 0 }}
        period="monthly"
        features={["3 projects", "1 GB storage", { label: "Analytics", included: false }]}
        ctaLabel="Start for free"
      />
      <PricingCard
        className="relative"
        variant="gradient"
        isPopular
        popularLabel="Popular"
        name="Pro"
        icon={<Rocket />}
        description="Growing teams"
        price={{ monthly: 29, yearly: 279 }}
        period="monthly"
        features={["Unlimited projects", "100 GB storage", "Analytics", "Priority support"]}
      />
      <PricingCard
        className="relative"
        isBlurred
        name="Enterprise"
        icon={<Building2 />}
        description="Large companies"
        price="Custom"
        period="monthly"
        features={["SSO & SAML", "SLA 99.99%", "Dedicated manager"]}
        ctaLabel="Contact sales"
      />
    </div>
  );
}
