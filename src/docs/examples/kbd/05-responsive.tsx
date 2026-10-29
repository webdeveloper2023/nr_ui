import { Kbd } from "nr-ui-kit";

// Resize the window: the shortcut hint disappears on mobile and tablet, where there is no keyboard.
export default function KbdResponsive() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      Search the docs
      <Kbd keys="command" responsive>
        K
      </Kbd>
    </p>
  );
}
