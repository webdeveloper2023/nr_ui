import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type TimelineColor = "default" | "accent" | "success" | "warning" | "danger";

export interface TimelineItemData {
  /** Unique key */
  id: string;
  /** Event title */
  title: ReactNode;
  /** Extra description */
  description?: ReactNode;
  /** Timestamp */
  time?: string;
  /** Icon inside the dot */
  icon?: ReactNode;
  /** Dot color */
  color?: TimelineColor;
  /** Extra content below (card, etc.) */
  content?: ReactNode;
}

export interface TimelineProps {
  /** List of events */
  items: TimelineItemData[];
  /** Extra classes */
  className?: string;
}

const dotStyles: Record<TimelineColor, string> = {
  default: "bg-default text-muted",
  accent: "bg-accent-soft text-accent-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
};

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3.5 pb-6 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-[13.5px] top-8 bottom-1.5 w-px bg-separator" />}
          <span className={cn("relative flex items-center justify-center w-7 h-7 shrink-0 rounded-full [&_svg]:size-3.5", dotStyles[item.color ?? "default"])}>
            {item.icon ?? <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-[3px]">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-foreground">{item.title}</p>
              {item.time && <time className="shrink-0 text-xs text-muted tabular-nums">{item.time}</time>}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-muted">{item.description}</p>}
            {item.content && <div className="mt-2.5">{item.content}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Timeline;
