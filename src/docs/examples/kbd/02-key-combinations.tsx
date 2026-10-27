import { Kbd } from "nr-ui-kit";

export default function KbdCombinations() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Kbd keys={["command", "shift"]}>N</Kbd>
      <Kbd keys={["ctrl", "alt"]}>Delete</Kbd>
      <Kbd keys={["option", "command"]}>I</Kbd>
      <Kbd keys={["command", "shift", "option"]}>P</Kbd>
    </div>
  );
}
