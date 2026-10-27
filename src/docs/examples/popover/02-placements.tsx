import { Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

const placements = ["top", "bottom", "left", "right", "top-start", "bottom-end"] as const;

export default function PopoverPlacements() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {placements.map((p) => (
        <Popover key={p} placement={p} showArrow>
          <PopoverTrigger>
            <Button size="sm" variant="tertiary">
              {p}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="px-3 py-2">
            <p className="text-sm text-foreground">placement="{p}"</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
