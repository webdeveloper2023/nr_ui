import { Textarea } from "nr-ui-kit";

export default function TextareaVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Textarea variant="primary" label="Primary" placeholder="On the gray canvas" minRows={3} />
      <div className="rounded-3xl bg-surface p-5 shadow-surface">
        <Textarea variant="secondary" label="Secondary" placeholder="Inside a card" minRows={3} />
      </div>
    </div>
  );
}
