import { Button, Tooltip } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function TooltipSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => (
        <Tooltip key={size} content={`Tooltip — ${size}`} size={size} showArrow>
          <Button variant="secondary">{size}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
