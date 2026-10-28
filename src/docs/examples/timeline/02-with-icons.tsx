import { AlertTriangle, CheckCircle2, GitCommit, Rocket, XCircle } from "lucide-react";
import { Timeline } from "nr-ui-kit";

export default function TimelineWithIcons() {
  return (
    <Timeline
      className="mx-auto max-w-md"
      items={[
        { id: "1", title: "New commit: feat/sidebar", description: "main branch", time: "2 min", icon: <GitCommit />, color: "accent" },
        { id: "2", title: "Tests passed", description: "128 / 128", time: "5 min", icon: <CheckCircle2 />, color: "success" },
        { id: "3", title: "Bundle size increased", description: "+12 KB", time: "6 min", icon: <AlertTriangle />, color: "warning" },
        { id: "4", title: "Staging deploy failed", time: "8 min", icon: <XCircle />, color: "danger" },
        { id: "5", title: "Released to production", time: "20 min", icon: <Rocket /> },
      ]}
    />
  );
}
