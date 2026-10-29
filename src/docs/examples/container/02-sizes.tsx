import { Container } from "nr-ui-kit";

const sizes = ["sm", "md", "lg", "xl"] as const;

export default function ContainerSizes() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-surface-secondary py-4">
      {sizes.map((size) => (
        <Container key={size} size={size} padding="none">
          <div className="rounded-xl bg-accent-soft py-2 text-center text-sm font-medium text-accent-soft-foreground">{size}</div>
        </Container>
      ))}
    </div>
  );
}
