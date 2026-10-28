import { useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

export default function PopoverBackdropControlled() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover backdrop="blur" placement="bottom">
        <PopoverTrigger>
          <Button variant="tertiary">backdrop="blur"</Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <p className="text-sm text-muted">The background is blurred — all focus stays on this panel.</p>
        </PopoverContent>
      </Popover>

      <Popover isOpen={open} onOpenChange={setOpen} placement="bottom">
        <PopoverTrigger>
          <Button variant="secondary">Controlled: {open ? "open" : "closed"}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <p className="text-sm text-muted">The state is controlled with useState.</p>
          <Button size="sm" variant="tertiary" className="mt-3" onClick={() => setOpen(false)}>
            Close
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
