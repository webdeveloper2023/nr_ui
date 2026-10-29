import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

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
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** List of events */
  items: TimelineItemData[];
  /** Extra classes */
  className?: string;
  /** Adapts to the screen: on mobile items sit tighter and the time moves under the title instead of squeezing it; on desktop items get more room. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

// Mobile: tighter rhythm, time under the title. Desktop: roomier rhythm.
const itemR: BreakpointClasses = { m: "mobile:gap-3 mobile:pb-5 mobile:last:pb-0", d: "desktop:gap-4 desktop:pb-8 desktop:last:pb-0" };
const headR: BreakpointClasses = { m: "mobile:flex-col mobile:items-start mobile:gap-0.5" };

const dotStyles: Record<TimelineColor, string> = {
  default: "bg-default text-muted",
  accent: "bg-accent-soft text-accent-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
};

export function Timeline({ items, className = "", responsive }: TimelineProps) {
  const bps = useResponsive(responsive);
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={item.id} className={cn("relative flex gap-3.5 pb-6 last:pb-0", rx(bps, itemR))}>
          {i < items.length - 1 && <span className="absolute left-[13.5px] top-8 bottom-1.5 w-px bg-separator" />}
          <span className={cn("relative flex items-center justify-center w-7 h-7 shrink-0 rounded-full [&_svg]:size-3.5", dotStyles[item.color ?? "default"])}>
            {item.icon ?? <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-[3px]">
            <div className={cn("flex items-baseline justify-between gap-3", rx(bps, headR))}>
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
