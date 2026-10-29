import { Input } from "nr-ui-kit";

const placements = ["outside", "outside-left", "inside", "floating", "floating-inside"] as const;

// Five placements, one prop. "floating" moves onto the border; "floating-inside" moves to the top inside the box.
export default function Placements() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {placements.map((placement) => (
        <Input key={placement} label={placement} labelPlacement={placement} placeholder="Type here" />
      ))}
    </div>
  );
}
