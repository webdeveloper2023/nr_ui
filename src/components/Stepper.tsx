import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type StepperColor = "default" | "accent" | "success" | "warning" | "danger";

export interface StepItem {
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
}

export interface StepperProps {
  /** List of steps */
  steps: StepItem[];
  /** Current step index (0-based) */
  currentStep: number;
  /** Called when a step is clicked (completed steps only) */
  onStepChange?: (step: number) => void;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Color theme */
  color?: StepperColor;
  /** Extra CSS classes */
  className?: string;
}

const colorMap: Record<StepperColor, { solid: string; ring: string; line: string }> = {
  default: { solid: "bg-foreground text-background", ring: "outline-foreground text-foreground", line: "bg-foreground" },
  accent: { solid: "bg-accent text-accent-foreground", ring: "outline-accent text-accent", line: "bg-accent" },
  success: { solid: "bg-success text-success-foreground", ring: "outline-success text-success-soft-foreground", line: "bg-success" },
  warning: { solid: "bg-warning text-warning-foreground", ring: "outline-warning text-warning-soft-foreground", line: "bg-warning" },
  danger: { solid: "bg-danger text-danger-foreground", ring: "outline-danger text-danger", line: "bg-danger" },
};

export function Stepper({ steps, currentStep, onStepChange, orientation = "horizontal", color = "accent", className = "" }: StepperProps) {
  const isVertical = orientation === "vertical";
  const c = colorMap[color];

  return (
    <ol className={cn("flex", isVertical ? "flex-col" : "items-start", className)}>
      {steps.map((step, i) => {
        const status = i < currentStep ? "complete" : i === currentStep ? "active" : "upcoming";
        const isLast = i === steps.length - 1;
        const clickable = Boolean(onStepChange) && i <= currentStep;

        return (
          <li
            key={step.title}
            aria-current={status === "active" ? "step" : undefined}
            className={cn("relative flex", isVertical ? "gap-3.5 pb-7 last:pb-0" : "flex-1 flex-col items-center text-center")}
          >
            {!isLast && (
              <span
                className={cn(
                  "absolute bg-separator overflow-hidden rounded-full",
                  isVertical ? "left-[15px] top-10 bottom-2 w-0.5" : "top-[15px] left-[calc(50%+22px)] right-[calc(-50%+22px)] h-0.5"
                )}
              >
                <span
                  className={cn(
                    "absolute inset-0 transition-transform duration-500 ease-(--ease-out-soft)",
                    c.line,
                    isVertical ? "origin-top" : "origin-left",
                    i < currentStep ? "scale-100" : isVertical ? "scale-y-0" : "scale-x-0"
                  )}
                />
              </span>
            )}
            <button
              disabled={!clickable}
              onClick={() => clickable && onStepChange?.(i)}
              aria-label={`${i + 1}. ${step.title}`}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 shrink-0 rounded-full text-sm font-medium tabular-nums",
                "transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                status !== "active" && "outline-none",
                status === "complete" && c.solid,
                status === "active" && cn("bg-surface shadow-surface outline-2", c.ring),
                status === "upcoming" && "bg-default text-muted",
                clickable ? "cursor-pointer active:scale-95" : "cursor-default"
              )}
            >
              {status === "complete" ? <Check size={15} strokeWidth={2.75} className="animate-scale-in" /> : i + 1}
            </button>
            <div className={isVertical ? "pt-1" : "mt-2.5 px-2"}>
              <p className={cn("text-sm font-medium transition-colors", status === "upcoming" ? "text-muted" : "text-foreground")}>{step.title}</p>
              {step.description && <p className="mt-0.5 text-xs text-muted">{step.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
