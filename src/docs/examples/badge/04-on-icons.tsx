import { Bell, MessageCircle, ShoppingCart } from "lucide-react";
import { Badge, Button } from "nr-ui-kit";

export default function BadgeOnIcons() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Badge content="4" shape="rectangle">
        <Button isIconOnly variant="tertiary" aria-label="Bildirishnomalar">
          <Bell size={18} />
        </Button>
      </Badge>
      <Badge content="12" color="accent" shape="rectangle">
        <Button isIconOnly variant="tertiary" aria-label="Xabarlar">
          <MessageCircle size={18} />
        </Button>
      </Badge>
      <Badge isDot shape="rectangle">
        <Button isIconOnly variant="tertiary" aria-label="Savat">
          <ShoppingCart size={18} />
        </Button>
      </Badge>
    </div>
  );
}
