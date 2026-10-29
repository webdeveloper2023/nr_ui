import { Alert, Button } from "nr-ui-kit";

// Resize the window: on mobile the action moves under the text, on desktop the padding opens up.
export default function AlertResponsive() {
  return (
    <div className="mx-auto max-w-xl">
      <Alert
        responsive
        color="accent"
        variant="soft"
        title="A new version is available"
        description="Version 2.4 brings faster sync and offline mode. Restart the app to update."
        action={
          <Button size="sm" responsive>
            Restart
          </Button>
        }
        onClose={() => {}}
      />
    </div>
  );
}
