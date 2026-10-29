import { Switch } from "nr-ui-kit";

export default function SwitchResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
      {/* Phone-sized track (48×28) and a 44px tap row on mobile */}
      <Switch defaultSelected responsive>
        Wi-Fi
      </Switch>
      {/* Desktop only: lg grows a step */}
      <Switch size="lg" responsive={["d"]}>
        Bluetooth
      </Switch>
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
