import { Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

export default function PopoverBasic() {
  return (
    <div className="flex justify-center">
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button variant="tertiary">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <p className="text-sm font-medium text-foreground">Popover title</p>
          <p className="mt-1 text-sm text-muted">A panel that opens on click. Click outside or press Escape to close it.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
