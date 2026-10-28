import { Button, useToast } from "nr-ui-kit";

const items = [
  { color: "default", title: "Reminder", description: "Your meeting starts in 15 minutes." },
  { color: "accent", title: "Update", description: "A new version is available." },
  { color: "success", title: "Payment received", description: "$29 — Pro plan." },
  { color: "warning", title: "Heads up", description: "Storage is 90% full." },
  { color: "danger", title: "Error", description: "Lost connection to the server." },
] as const;

export default function ToastColors() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <Button key={item.color} variant="tertiary" className="capitalize" onClick={() => addToast(item)}>
          {item.color}
        </Button>
      ))}
    </div>
  );
}
