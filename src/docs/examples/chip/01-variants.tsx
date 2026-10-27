import { Chip } from "nr-ui-kit";

const colors = ["accent", "default", "success", "warning", "danger"] as const;
const variants = ["primary", "secondary", "tertiary", "soft"] as const;

export default function ChipVariants() {
  return (
    <div className="mx-auto w-fit space-y-3">
      <div className="grid grid-cols-[80px_repeat(5,1fr)] items-center gap-x-4 text-xs text-muted">
        <span />
        {colors.map((c) => (
          <span key={c} className="text-center capitalize">{c}</span>
        ))}
      </div>
      {variants.map((v) => (
        <div key={v} className="grid grid-cols-[80px_repeat(5,1fr)] items-center gap-x-4">
          <span className="text-sm capitalize text-muted">{v}</span>
          {colors.map((c) => (
            <span key={c} className="flex justify-center">
              <Chip variant={v} color={c}>Label</Chip>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
