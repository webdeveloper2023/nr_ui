import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";
import { SlidersHorizontal } from "lucide-react";

export default function PopoverWithForm() {
  return (
    <div className="flex justify-center">
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button variant="tertiary" startContent={<SlidersHorizontal size={16} />}>
            Dimensions
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          {(onClose) => (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Dimensions</p>
                <p className="text-xs text-muted">Set the element size</p>
              </div>
              <Input size="sm" variant="secondary" label="Width" defaultValue="100%" />
              <Input size="sm" variant="secondary" label="Height" defaultValue="320px" />
              <div className="mt-1 flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onClose}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
