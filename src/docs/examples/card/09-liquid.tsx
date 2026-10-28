import { Droplets, Snowflake } from "lucide-react";
import { Card, CardBody, CardHeader, Chip } from "nr-ui-kit";

export default function CardLiquidGlass() {
  return (
    <div className="relative grid w-full gap-4 overflow-hidden rounded-3xl p-6 sm:grid-cols-2 sm:p-10">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <Card variant="glass" material="frosted" className="relative">
        <CardHeader title="Frosted" description="Klassik xira shisha" endContent={<Snowflake size={18} className="text-muted" />} />
        <CardBody>
          <p className="text-foreground/75">Kuchli blur, oq tus — matn har qanday fonda o'qiladi.</p>
          <Chip variant="glass" material="frosted" className="mt-1">material="frosted"</Chip>
        </CardBody>
      </Card>
      <Card variant="glass" material="liquid" className="relative">
        <CardHeader title="Liquid" description="Clear glass, shining edges" endContent={<Droplets size={18} className="text-muted" />} />
        <CardBody>
          <p className="text-foreground/75">Shaffofroq, chetlarida yorug'lik aksi va ichki nur — linza kabi.</p>
          <Chip variant="glass" material="liquid" className="mt-1">material="liquid"</Chip>
        </CardBody>
      </Card>
    </div>
  );
}
