import { useEffect, useState } from "react";
import { Button, Progress } from "nr-ui-kit";
import { FileText } from "lucide-react";

export default function ProgressUploadCard() {
  const [value, setValue] = useState(12);

  useEffect(() => {
    if (value >= 100) return;
    const timer = setTimeout(() => setValue((v) => Math.min(100, v + 7)), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-surface p-4 shadow-surface">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
          <FileText size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">hisobot-2026.pdf</p>
          <p className="text-xs text-muted">{value < 100 ? `${(value * 0.24).toFixed(1)} / 24 MB` : "Yuklandi"}</p>
        </div>
        <span className="text-sm tabular-nums text-muted">{value}%</span>
      </div>
      <Progress className="mt-4" value={value} color={value < 100 ? "accent" : "success"} size="sm" />
      <Button className="mt-4" size="sm" variant="tertiary" fullWidth onClick={() => setValue(0)}>
        Qayta yuklash
      </Button>
    </div>
  );
}
