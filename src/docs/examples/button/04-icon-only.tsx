import { Button } from "nr-ui-kit";
import { Bell, Heart, Settings, Share2, Trash2 } from "lucide-react";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button isIconOnly aria-label="Sevimli">
        <Heart size={18} />
      </Button>
      <Button isIconOnly variant="secondary" aria-label="Bildirishnomalar">
        <Bell size={18} />
      </Button>
      <Button isIconOnly variant="tertiary" aria-label="Ulashish">
        <Share2 size={18} />
      </Button>
      <Button isIconOnly variant="outline" aria-label="Sozlamalar">
        <Settings size={18} />
      </Button>
      <Button isIconOnly variant="danger-soft" aria-label="O'chirish">
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
