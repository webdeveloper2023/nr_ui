import { Button, Tooltip } from "nr-ui-kit";
import { Share2 } from "lucide-react";

export default function TooltipBasic() {
  return (
    <div className="flex justify-center gap-3">
      <Tooltip content="Copy link">
        <Button variant="tertiary" isIconOnly aria-label="Share">
          <Share2 size={16} />
        </Button>
      </Tooltip>
      <Tooltip content="This button saves your changes">
        <Button variant="tertiary">Hover me</Button>
      </Tooltip>
    </div>
  );
}
