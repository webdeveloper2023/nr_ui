import { Bell } from "lucide-react";
import { Badge, Button } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {sizes.map((size) => (
        <Badge key={size} content="5" color="danger" size={size}>
          <Button isIconOnly variant="secondary" aria-label={`Notifications (${size})`}>
            <Bell size={18} />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
