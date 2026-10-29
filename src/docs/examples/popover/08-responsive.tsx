import { Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

// Resize the window: on mobile the popover opens as a bottom sheet over a dimmed page.
export default function PopoverResponsive() {
  return (
    <div className="flex justify-center">
      <Popover responsive placement="bottom">
        <PopoverTrigger>
          <Button variant="tertiary">Share</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <p className="text-sm font-medium text-foreground">Share "Q3 report"</p>
          <p className="mt-1 text-sm text-muted">Anyone with the link can view. Editors can be added in settings.</p>
          <Button className="mt-4" fullWidth responsive>
            Copy link
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
