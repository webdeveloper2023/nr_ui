import { Chip } from "nr-ui-kit";

export default function ChipSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {(["primary", "soft"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <Chip size="xs" color="accent" variant={variant}>Juda kichik</Chip>
          <Chip size="sm" color="accent" variant={variant}>Kichik</Chip>
          <Chip size="md" color="accent" variant={variant}>O'rta</Chip>
          <Chip size="lg" color="accent" variant={variant}>Katta</Chip>
        </div>
      ))}
    </div>
  );
}
