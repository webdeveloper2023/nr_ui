import { Switch } from "nr-ui-kit";

export default function SwitchColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Switch color="accent" defaultSelected>Accent</Switch>
      <Switch color="default" defaultSelected>Default</Switch>
      <Switch color="success" defaultSelected>Success</Switch>
      <Switch color="warning" defaultSelected>Warning</Switch>
      <Switch color="danger" defaultSelected>Danger</Switch>
    </div>
  );
}
