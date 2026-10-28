import React, {
  useState,
  useRef,
  useEffect,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import {
  useFloating,
  usePresence,
  getSide,
  originClass,
  hiddenShift,
  arrowPosition,
  arrowClipPath,
  GLASS_THICK_BG,
  setRef,
  type Placement,
} from "./floating";

type TooltipPlacement = Placement;
type TooltipColor = "default" | "foreground" | "accent" | "success" | "warning" | "danger";
type TooltipSize = "xs" | "sm" | "md" | "lg";
type TooltipRadius = "sm" | "md" | "lg" | "full";

export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Placement side */
  placement?: TooltipPlacement;
  /** Color theme */
  color?: TooltipColor;
  /** Size */
  size?: TooltipSize;
  /** Corner radius */
  radius?: TooltipRadius;
  /** Delay before opening (ms) */
  delay?: number;
  /** Delay before closing (ms) */
  closeDelay?: number;
  /** Distance from the trigger (px) */
  offset?: number;
  /** Shows the pointer arrow */
  showArrow?: boolean;
  /** Glass (blur) background — default color only; colored tooltips stay solid */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Disabled (inactive) state */
  isDisabled?: boolean;
  /** Open state (controlled) */
  isOpen?: boolean;
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Extra CSS classes */
  className?: string;
  /** Trigger element (a single React element) */
  children: ReactElement;
}

const colorStyles: Record<TooltipColor, string> = {
  default: "bg-overlay text-foreground shadow-overlay",
  foreground: "bg-foreground text-background shadow-overlay",
  accent: "bg-accent text-accent-foreground shadow-overlay",
  success: "bg-success text-success-foreground shadow-overlay",
  warning: "bg-warning text-warning-foreground shadow-overlay",
  danger: "bg-danger text-danger-foreground shadow-overlay",
};

const arrowColorStyles: Record<TooltipColor, string> = {
  default: "bg-overlay",
  foreground: "bg-foreground",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const sizeStyles: Record<TooltipSize, string> = {
  xs: "px-1.5 py-0.5 text-[11px]",
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-xs",
  lg: "px-3 py-2 text-sm",
};

const radiusStyles: Record<TooltipRadius, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

type ChildProps = {
  onMouseEnter?: (e: SyntheticEvent) => void;
  onMouseLeave?: (e: SyntheticEvent) => void;
  onFocus?: (e: SyntheticEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
  ref?: unknown;
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  color = "default",
  size = "md",
  radius = "md",
  delay = 300,
  closeDelay = 150,
  offset = 8,
  showArrow = false,
  isBlurred = true,
  material,
  isDisabled = false,
  isOpen: openProp,
  defaultOpen = false,
  onOpenChange,
  className = "",
  children,
}) => {
  const [openState, setOpenState] = useState(defaultOpen);
  const isOpen = (openProp ?? openState) && !isDisabled;
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { mounted, visible } = usePresence(isOpen, 120);
  const floating = useFloating(mounted, triggerRef, tooltipRef, placement, offset);
  const side = getSide(floating.placement);
  const isGlass = isBlurred && color === "default";

  const setOpen = (open: boolean) => {
    setOpenState(open);
    onOpenChange?.(open);
  };

  const show = () => {
    if (isDisabled) return;
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(
    () => () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    },
    []
  );

  if (!isValidElement<ChildProps>(children)) return children;
  const childProps = children.props;
  const childRef = (children as unknown as { ref?: unknown }).ref ?? childProps.ref;

  const child = React.cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      setRef(childRef, el);
    },
    onMouseEnter: (e: SyntheticEvent) => {
      show();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: SyntheticEvent) => {
      hide();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: SyntheticEvent) => {
      show();
      childProps.onFocus?.(e);
    },
    onBlur: (e: SyntheticEvent) => {
      hide();
      childProps.onBlur?.(e);
    },
  } as ChildProps);

  return (
    <>
      {child}
      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            data-glass={material}
            className={cn(
              "z-[9999] max-w-xs leading-snug pointer-events-auto",
              "transition-[opacity,transform] duration-150 ease-(--ease-out-soft)",
              originClass[side],
              isGlass ? "glass-thick text-foreground" : colorStyles[color],
              sizeStyles[size],
              radiusStyles[radius],
              visible ? "opacity-100 scale-100 translate-x-0 translate-y-0" : cn("opacity-0 scale-[0.96]", hiddenShift[side]),
              className
            )}
            style={floating.style}
            onMouseEnter={() => clearTimeout(hideTimer.current)}
            onMouseLeave={hide}
          >
            <span className="relative z-10">{content}</span>
            {showArrow && (
              <span
                className={cn("absolute w-2 h-2 rotate-45", !isGlass && arrowColorStyles[color], arrowPosition(floating.placement))}
                style={isGlass ? { backgroundColor: GLASS_THICK_BG, clipPath: arrowClipPath(floating.placement) } : undefined}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
export default Tooltip;
