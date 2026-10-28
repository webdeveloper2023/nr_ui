import { Switch } from "nr-ui-kit";
import { Bell, BellOff, Check, Mic, MicOff, Moon, Sun } from "lucide-react";

export default function SwitchWithIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Switch color="success" defaultSelected thumbIcon={<Check />} aria-label="Confirm" />
      <Switch
        size="lg"
        defaultSelected
        thumbIcon={({ isSelected }) => (isSelected ? <Sun /> : <Moon />)}
        aria-label="Theme"
      />
      <Switch color="danger" thumbIcon={({ isSelected }) => (isSelected ? <Mic /> : <MicOff />)} aria-label="Microphone" />
      <Switch size="lg" startContent={<Bell />} endContent={<BellOff />} defaultSelected>
        Notifications
      </Switch>
    </div>
  );
}
