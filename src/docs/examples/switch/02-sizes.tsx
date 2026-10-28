import { Switch } from "nr-ui-kit";

export default function SwitchSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Switch size="xs">Extra small</Switch>
      <Switch size="sm">Small</Switch>
      <Switch size="md" defaultSelected>Medium</Switch>
      <Switch size="lg">Large</Switch>
    </div>
  );
}
