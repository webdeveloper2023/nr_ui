import { AlertTriangle, CheckCircle2, GitCommit, Rocket, XCircle } from "lucide-react";
import { Timeline } from "nr-ui-kit";

export default function TimelineWithIcons() {
  return (
    <Timeline
      className="mx-auto max-w-md"
      items={[
        { id: "1", title: "Yangi commit: feat/sidebar", description: "main branch", time: "2 daq", icon: <GitCommit />, color: "accent" },
        { id: "2", title: "Testlar o'tdi", description: "128 / 128", time: "5 daq", icon: <CheckCircle2 />, color: "success" },
        { id: "3", title: "Bundle hajmi oshdi", description: "+12 KB", time: "6 daq", icon: <AlertTriangle />, color: "warning" },
        { id: "4", title: "Staging deploy xatosi", time: "8 daq", icon: <XCircle />, color: "danger" },
        { id: "5", title: "Production'ga chiqarildi", time: "20 daq", icon: <Rocket /> },
      ]}
    />
  );
}
