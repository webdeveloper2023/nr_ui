import { Heart, Pause, Plus, Share } from "lucide-react";
import { Button } from "nr-ui-kit";

export default function ButtonLiquidGlass() {
  return (
    <div className="relative grid w-full gap-6 overflow-hidden rounded-3xl p-8 sm:grid-cols-2 sm:p-10">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      {(["frosted", "liquid"] as const).map((material) => (
        <div key={material} className="relative flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">{material}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="glass" material={material} startContent={<Plus size={16} />}>Add</Button>
            <Button variant="glass" material={material} isIconOnly aria-label="Like"><Heart size={18} /></Button>
            <Button variant="glass" material={material} isIconOnly aria-label="Share"><Share size={18} /></Button>
          </div>
          <Button variant="glass" material={material} size="lg" isIconOnly aria-label="Pause"><Pause size={22} /></Button>
        </div>
      ))}
    </div>
  );
}
