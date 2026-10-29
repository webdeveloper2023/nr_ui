import { Chip, Hide, Show } from "nr-ui-kit";

// Pure CSS: the right content is in the first paint, even with server rendering.
export default function ShowAndHide() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Show on={["m"]}>
        <Chip color="accent">Only on mobile</Chip>
      </Show>
      <Show on={["t", "l"]}>
        <Chip color="success">Tablet or laptop</Chip>
      </Show>
      <Show on="d">
        <Chip color="warning">Only on desktop</Chip>
      </Show>
      <Hide on={["m"]}>
        <Chip>Hidden on mobile</Chip>
      </Hide>
    </div>
  );
}
