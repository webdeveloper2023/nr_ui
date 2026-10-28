import { Alert, Button } from "nr-ui-kit";
import { Rocket } from "lucide-react";

export default function AlertCustomContent() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <Alert
        color="accent"
        icon={<Rocket size={18} />}
        title="Ready to deploy"
        description="3 changes on the main branch are ready for production."
      >
        <ul className="list-disc space-y-1 pl-4 text-muted">
          <li>New Sidebar component</li>
          <li>Fixed dark mode colors</li>
          <li>Faster table sorting</li>
        </ul>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Deploy</Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </div>
      </Alert>
      <Alert hideIcon color="default" description="A plain text-only message without an icon." />
    </div>
  );
}
