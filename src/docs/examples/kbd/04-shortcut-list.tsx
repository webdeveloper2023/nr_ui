import { Card, Kbd, type KbdKey } from "nr-ui-kit";

const shortcuts: { label: string; keys: KbdKey[]; key: string }[] = [
  { label: "Qidirish", keys: ["command"], key: "K" },
  { label: "Yangi fayl", keys: ["command"], key: "N" },
  { label: "Saqlash", keys: ["command"], key: "S" },
  { label: "Buyruqlar paneli", keys: ["command", "shift"], key: "P" },
];

export default function KbdShortcutList() {
  return (
    <Card className="mx-auto w-full max-w-sm p-2">
      {shortcuts.map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-surface-secondary">
          {s.label}
          <Kbd keys={s.keys}>{s.key}</Kbd>
        </div>
      ))}
    </Card>
  );
}
