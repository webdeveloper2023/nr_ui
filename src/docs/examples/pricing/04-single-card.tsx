import { PricingCard, useToast } from "nr-ui-kit";

export default function PricingSingleCard() {
  const { addToast } = useToast();

  return (
    <div className="mx-auto w-full max-w-sm">
      <PricingCard
        name="Lifetime"
        description="Bir marta to'lang — umrbod foydalaning"
        price="$199"
        period="monthly"
        ctaLabel="Sotib olish"
        isPopular
        popularLabel="Chegirma"
        features={["Barcha komponentlar", "Kelajakdagi yangilanishlar", "Figma fayllari", "Shaxsiy Discord kanal"]}
        onSelect={() => addToast({ title: "Savatga qo'shildi", color: "success" })}
      />
    </div>
  );
}
