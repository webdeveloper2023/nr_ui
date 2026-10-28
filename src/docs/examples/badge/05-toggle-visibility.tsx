import { useState } from "react";
import { Bell } from "lucide-react";
import { Badge, Button, Switch } from "nr-ui-kit";

export default function BadgeToggle() {
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex flex-col items-center gap-5">
      <Badge content={count} isInvisible={!visible || count === 0} shape="rectangle">
        <Button isIconOnly variant="tertiary" aria-label="Notifications">
          <Bell size={18} />
        </Button>
      </Badge>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="tertiary" onClick={() => setCount(Math.max(0, count - 1))}>−</Button>
        <Button size="sm" variant="tertiary" onClick={() => setCount(count + 1)}>+</Button>
        <Switch size="sm" isSelected={visible} onValueChange={setVisible}>Show</Switch>
      </div>
    </div>
  );
}
