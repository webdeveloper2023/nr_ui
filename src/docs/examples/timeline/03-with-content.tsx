import { FileText, MessageSquare } from "lucide-react";
import { Timeline } from "nr-ui-kit";

export default function TimelineWithContent() {
  return (
    <Timeline
      className="mx-auto max-w-md"
      items={[
        {
          id: "1",
          title: <><span className="font-medium">Dilnoza</span> izoh qoldirdi</>,
          time: "Bugun",
          icon: <MessageSquare />,
          color: "accent",
          content: <div className="rounded-2xl bg-surface p-3 text-sm text-muted shadow-surface">"Yangi dizayn ancha toza chiqibdi, rahmat!"</div>,
        },
        {
          id: "2",
          title: <><span className="font-medium">Jasur</span> fayl yukladi</>,
          time: "Kecha",
          icon: <FileText />,
          content: (
            <div className="flex items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-surface">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-default text-muted"><FileText size={16} /></span>
              <div>
                <p className="text-sm font-medium text-foreground">brief-v2.pdf</p>
                <p className="text-xs text-muted">2.4 MB</p>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
