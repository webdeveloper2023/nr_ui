import { Button } from "nr-ui-kit";
import { Bell, Heart, Settings, Share2, Trash2 } from "lucide-react";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button isIconOnly aria-label="Favorite">
        <Heart size={18} />
      </Button>
      <Button isIconOnly variant="secondary" aria-label="Notifications">
        <Bell size={18} />
      </Button>
      <Button isIconOnly variant="tertiary" aria-label="Share">
        <Share2 size={18} />
      </Button>
      <Button isIconOnly variant="outline" aria-label="Settings">
        <Settings size={18} />
      </Button>
      <Button isIconOnly variant="danger-soft" aria-label="Delete">
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
