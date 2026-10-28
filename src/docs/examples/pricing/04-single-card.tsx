import { PricingCard, useToast } from "nr-ui-kit";

export default function PricingSingleCard() {
  const { addToast } = useToast();

  return (
    <div className="mx-auto w-full max-w-sm">
      <PricingCard
        name="Lifetime"
        description="Pay once — use it forever"
        price="$199"
        period="monthly"
        ctaLabel="Buy now"
        isPopular
        popularLabel="Sale"
        features={["All components", "Future updates", "Figma files", "Private Discord channel"]}
        onSelect={() => addToast({ title: "Added to cart", color: "success" })}
      />
    </div>
  );
}
