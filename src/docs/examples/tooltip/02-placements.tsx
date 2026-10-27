import { Button, Tooltip } from "nr-ui-kit";

const rows = [
  ["top-start", "top", "top-end"],
  ["left-start", "", "right-start"],
  ["left", "", "right"],
  ["left-end", "", "right-end"],
  ["bottom-start", "bottom", "bottom-end"],
] as const;

export default function TooltipPlacements() {
  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-2">
      {rows.flat().map((p, i) =>
        p ? (
          <Tooltip key={p} content={p} placement={p} showArrow>
            <Button size="sm" variant="tertiary" className="w-28">
              {p}
            </Button>
          </Tooltip>
        ) : (
          <span key={i} />
        )
      )}
    </div>
  );
}
