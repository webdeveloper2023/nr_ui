import { Button, Input } from "nr-ui-kit";

// Shrink the window below 768px: the responsive ones become touch-sized (44px, 16px text).
export default function ResponsiveProp() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="tertiary">Static</Button>
        <Button responsive>All breakpoints</Button>
        <Button variant="secondary" responsive={["m"]}>Mobile only</Button>
      </div>
      <Input label="Static" placeholder="Same everywhere" />
      <Input label="responsive" placeholder="Adapts on m, t, l, d" responsive />
      <Input label='responsive={["m", "t"]}' placeholder="Adapts on mobile and tablet" responsive={["m", "t"]} />
    </div>
  );
}
