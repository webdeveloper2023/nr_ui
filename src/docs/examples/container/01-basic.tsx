import { Container } from "nr-ui-kit";

export default function ContainerBasic() {
  return (
    <div className="w-full rounded-2xl bg-surface-secondary py-4">
      <Container size="sm" className="rounded-xl bg-surface py-6 text-center text-sm shadow-surface">
        size="sm" — max 640px, centered, 24px gutters
      </Container>
    </div>
  );
}
