import { Input } from "nr-ui-kit";

export default function InputResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* All breakpoints: 44px with 16px text on mobile, touch-sized on tablet */}
      <Input label="Email" placeholder="you@example.com" responsive />
      {/* Mobile only: the left label moves on top of the field */}
      <Input label="City" labelPlacement="outside-left" placeholder="Tashkent" responsive={["m"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
