import { Button, Tooltip } from "nr-ui-kit";

const colors = ["default", "foreground", "accent", "success", "warning", "danger"] as const;

export default function TooltipColors() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {colors.map((color) => (
        <Tooltip key={color} content={`color="${color}"`} color={color}>
          <Button variant="tertiary" className="capitalize">
            {color}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
