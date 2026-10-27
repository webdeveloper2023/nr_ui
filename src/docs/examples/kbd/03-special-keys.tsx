import { Kbd } from "nr-ui-kit";

const keys = ["enter", "delete", "escape", "tab", "space", "up", "down", "left", "right"] as const;

export default function KbdSpecialKeys() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {keys.map((k) => (
        <Kbd key={k} keys={k} />
      ))}
    </div>
  );
}
