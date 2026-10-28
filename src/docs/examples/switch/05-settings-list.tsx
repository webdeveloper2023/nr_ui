import { useState } from "react";
import { Switch } from "nr-ui-kit";

const settings = [
  { key: "email", title: "Email notifications", description: "About activity on your account" },
  { key: "push", title: "Push notifications", description: "On your phone and browser" },
  { key: "weekly", title: "Weekly report", description: "Every Monday morning" },
];

export default function SwitchSettingsList() {
  const [on, setOn] = useState<Record<string, boolean>>({ email: true, push: false, weekly: true });

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-surface p-2 shadow-surface">
      {settings.map((s, i) => (
        <div key={s.key} className={i > 0 ? "border-t border-separator" : ""}>
          <label className="flex cursor-pointer items-center justify-between gap-4 px-3 py-3">
            <span>
              <span className="block text-sm font-medium text-foreground">{s.title}</span>
              <span className="block text-xs text-muted">{s.description}</span>
            </span>
            <Switch isSelected={on[s.key]} onValueChange={(v) => setOn({ ...on, [s.key]: v })} aria-label={s.title} />
          </label>
        </div>
      ))}
    </div>
  );
}
