import { Button, Tooltip } from "nr-ui-kit";

// Resize the window: on mobile the text is larger and the bubble never runs off the screen.
export default function TooltipResponsive() {
  return (
    <div className="flex justify-center">
      <Tooltip responsive content="Your changes are saved automatically every few seconds">
        <Button variant="tertiary" responsive>
          Autosave
        </Button>
      </Tooltip>
    </div>
  );
}
