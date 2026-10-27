import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";
import { SlidersHorizontal } from "lucide-react";

export default function PopoverWithForm() {
  return (
    <div className="flex justify-center">
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button variant="tertiary" startContent={<SlidersHorizontal size={16} />}>
            O'lchamlar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          {(onClose) => (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">O'lchamlar</p>
                <p className="text-xs text-muted">Element o'lchamini belgilang</p>
              </div>
              <Input size="sm" variant="secondary" label="Kenglik" defaultValue="100%" />
              <Input size="sm" variant="secondary" label="Balandlik" defaultValue="320px" />
              <div className="mt-1 flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={onClose}>
                  Bekor
                </Button>
                <Button size="sm" onClick={onClose}>
                  Saqlash
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
