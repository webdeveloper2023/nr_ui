import { Button, Tooltip } from "nr-ui-kit";
import { Share2 } from "lucide-react";

export default function TooltipBasic() {
  return (
    <div className="flex justify-center gap-3">
      <Tooltip content="Havolani nusxalash">
        <Button variant="tertiary" isIconOnly aria-label="Ulashish">
          <Share2 size={16} />
        </Button>
      </Tooltip>
      <Tooltip content="Bu tugma o'zgarishlarni saqlaydi">
        <Button variant="tertiary">Hover qiling</Button>
      </Tooltip>
    </div>
  );
}
