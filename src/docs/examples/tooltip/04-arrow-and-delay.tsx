import { useState } from "react";
import { Button, Tooltip } from "nr-ui-kit";

export default function TooltipArrowAndDelay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Tooltip content="Darhol chiqadi" delay={0} showArrow>
        <Button variant="tertiary">delay=0</Button>
      </Tooltip>
      <Tooltip content="1 soniyadan keyin" delay={1000} showArrow>
        <Button variant="tertiary">delay=1000</Button>
      </Tooltip>
      <Tooltip content="Boshqariladigan tooltip" isOpen={open} onOpenChange={setOpen} placement="bottom" color="foreground">
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {open ? "Yopish" : "Ochish"}
        </Button>
      </Tooltip>
    </div>
  );
}
