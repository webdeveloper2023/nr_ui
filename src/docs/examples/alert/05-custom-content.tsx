import { Alert, Button } from "nr-ui-kit";
import { Rocket } from "lucide-react";

export default function AlertCustomContent() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <Alert
        color="accent"
        icon={<Rocket size={18} />}
        title="Deploy tayyor"
        description="main branch'dagi 3 ta o'zgarish production'ga chiqishga tayyor."
      >
        <ul className="list-disc space-y-1 pl-4 text-muted">
          <li>Yangi Sidebar komponenti</li>
          <li>Dark mode ranglari tuzatildi</li>
          <li>Table saralash tezlashtirildi</li>
        </ul>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Deploy qilish</Button>
          <Button size="sm" variant="ghost">
            Keyinroq
          </Button>
        </div>
      </Alert>
      <Alert hideIcon color="default" description="Ikonkasiz, faqat matnli oddiy xabar." />
    </div>
  );
}
