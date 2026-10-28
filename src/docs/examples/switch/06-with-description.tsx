import { Switch } from "nr-ui-kit";

export default function SwitchWithDescription() {
  return (
    <div className="mx-auto flex w-fit flex-col gap-5">
      <Switch defaultSelected description="Saves automatically every 5 minutes">
        Auto-save
      </Switch>
      <Switch description="Installs updates as soon as they ship">Auto-update</Switch>
      <Switch isDisabled description="Pro plan only">
        Backups
      </Switch>
    </div>
  );
}
