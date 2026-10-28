import { useState } from "react";
import { Button, Tooltip } from "nr-ui-kit";

export default function TooltipArrowAndDelay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Tooltip content="Shows instantly" delay={0} showArrow>
        <Button variant="tertiary">delay=0</Button>
      </Tooltip>
      <Tooltip content="After 1 second" delay={1000} showArrow>
        <Button variant="tertiary">delay=1000</Button>
      </Tooltip>
      <Tooltip content="Controlled tooltip" isOpen={open} onOpenChange={setOpen} placement="bottom" color="foreground">
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"}
        </Button>
      </Tooltip>
    </div>
  );
}
