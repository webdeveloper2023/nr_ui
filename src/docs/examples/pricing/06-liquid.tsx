import { Droplets, Snowflake } from "lucide-react";
import { PricingCard } from "nr-ui-kit";

export default function PricingLiquidGlass() {
  return (
    <div className="relative grid w-full gap-6 overflow-hidden rounded-3xl p-6 sm:grid-cols-2 sm:p-10">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <PricingCard
        className="relative"
        isBlurred
        material="frosted"
        icon={<Snowflake />}
        name="Frosted"
        description="Classic frosted glass"
        price={{ monthly: 9, yearly: 90 }}
        period="monthly"
        features={["All components", "Dark mode", "Email support"]}
      />
      <PricingCard
        className="relative"
        isBlurred
        material="liquid"
        icon={<Droplets />}
        name="Liquid"
        description="Clear glass, shining edges"
        price={{ monthly: 19, yearly: 190 }}
        period="monthly"
        isPopular
        features={["All components", "Liquid material", "Priority support"]}
      />
    </div>
  );
}
