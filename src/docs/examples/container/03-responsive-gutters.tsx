import { Container } from "nr-ui-kit";

// Gutters for padding="lg": 16px mobile · 20px tablet · 24px laptop · 28px desktop.
export default function ResponsiveGutters() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl bg-surface-secondary py-4">
      <Container responsive paddingY="md" className="rounded-xl bg-surface text-sm shadow-surface">
        responsive — gutters follow the screen
      </Container>
      <Container padding={{ m: "sm", l: "xl" }} paddingY="md" className="rounded-xl bg-surface text-sm shadow-surface">
        {`padding={{ m: "sm", l: "xl" }} — an exact token per breakpoint`}
      </Container>
    </div>
  );
}
