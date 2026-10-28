import { Alert } from "nr-ui-kit";

const items = [
  { color: "default", title: "Note", description: "Your profile is 80% complete." },
  { color: "accent", title: "Info", description: "Scheduled maintenance on Sunday at 02:00." },
  { color: "success", title: "Saved", description: "All changes were saved successfully." },
  { color: "warning", title: "Heads up", description: "90% of your storage is used." },
  { color: "danger", title: "Error", description: "The payment could not be processed. Please check your card." },
] as const;

export default function AlertColors() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      {items.map((item) => (
        <Alert key={item.color} color={item.color} title={item.title} description={item.description} />
      ))}
    </div>
  );
}
