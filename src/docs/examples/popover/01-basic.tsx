import { Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

export default function PopoverBasic() {
  return (
    <div className="flex justify-center">
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button variant="tertiary">Popoverni ochish</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <p className="text-sm font-medium text-foreground">Popover sarlavhasi</p>
          <p className="mt-1 text-sm text-muted">Bosilganda ochiladigan panel. Tashqariga bosing yoki Escape — yopiladi.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
