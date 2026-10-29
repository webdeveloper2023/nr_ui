import { Textarea } from "nr-ui-kit";

export default function TextareaResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* 16px text and roomier padding on mobile */}
      <Textarea label="Message" placeholder="Write something…" responsive />
      {/* Desktop only: the lg size grows a step */}
      <Textarea label="Notes" size="lg" placeholder="Desktop only" responsive={["d"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
