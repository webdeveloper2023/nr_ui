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
          <p className="text-sm text-muted">Orqa fon xiralashtirildi — e'tibor faqat shu panelda.</p>
        </PopoverContent>
      </Popover>

      <Popover isOpen={open} onOpenChange={setOpen} placement="bottom">
        <PopoverTrigger>
          <Button variant="secondary">Controlled: {open ? "ochiq" : "yopiq"}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <p className="text-sm text-muted">Holat useState orqali boshqariladi.</p>
          <Button size="sm" variant="tertiary" className="mt-3" onClick={() => setOpen(false)}>
            Yopish
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
