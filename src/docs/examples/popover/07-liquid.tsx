import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

function ProfilePopover({ material }: { material: "frosted" | "liquid" }) {
  return (
    <Popover placement="bottom" showArrow material={material}>
      <PopoverTrigger>
        <Button variant="glass" material={material} className="capitalize">{material}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Madina Usmonova" color="accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Madina Usmonova</p>
            <p className="text-xs text-foreground/65">Product designer</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function PopoverLiquidGlass() {
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl p-8">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative flex flex-wrap justify-center gap-4">
        <ProfilePopover material="frosted" />
        <ProfilePopover material="liquid" />
      </div>
    </div>
  );
}
