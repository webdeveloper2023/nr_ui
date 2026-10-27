import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export interface TooltipProps {
  content: ReactNode;
  placement?: TooltipPlacement;
  color?: TooltipColor;
  delay?: number;
  closeDelay?: number;
  showArrow?: boolean;
  isDisabled?: boolean;
  children: ReactElement;
}

const colorStyles: Record<TooltipColor, string> = {
  default: "bg-default-800 text-white",
  primary: "bg-primary-500 text-white",
  secondary: "bg-primary-300 text-white",
  success: "bg-success-500 text-white",
  warning: "bg-warning-500 text-white",
  danger: "bg-danger-500 text-white",
};

const arrowColorStyles: Record<TooltipColor, string> = {
  default: "bg-default-800",
  primary: "bg-primary-500",
  secondary: "bg-primary-300",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  color = "default",
  delay = 400,
  closeDelay = 200,
  showArrow = true,
  isDisabled = false,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const tRect = trigger.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = tRect.top - ttRect.height - gap + window.scrollY;
        left = tRect.left + tRect.width / 2 - ttRect.width / 2 + window.scrollX;
        break;
      case "bottom":
        top = tRect.bottom + gap + window.scrollY;
        left = tRect.left + tRect.width / 2 - ttRect.width / 2 + window.scrollX;
        break;
      case "left":
        top = tRect.top + tRect.height / 2 - ttRect.height / 2 + window.scrollY;
        left = tRect.left - ttRect.width - gap + window.scrollX;
        break;
      case "right":
        top = tRect.top + tRect.height / 2 - ttRect.height / 2 + window.scrollY;
        left = tRect.right + gap + window.scrollX;
        break;
    }

    setPosition({ top, left });
  }, [placement]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  const show = () => {
    if (isDisabled) return;
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setIsVisible(false), closeDelay);
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const arrowPlacement: Record<TooltipPlacement, string> = {
    top: "left-1/2 -translate-x-1/2 -bottom-1",
    bottom: "left-1/2 -translate-x-1/2 -top-1",
    left: "top-1/2 -translate-y-1/2 -right-1",
    right: "top-1/2 -translate-y-1/2 -left-1",
  };

  const originMap: Record<TooltipPlacement, string> = {
    top: "origin-bottom",
    bottom: "origin-top",
    left: "origin-right",
    right: "origin-left",
  };

  const child = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
  } as Record<string, unknown>);

  return (
    <>
      {child}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={[
              "fixed z-[9999] px-2.5 py-1.5 text-xs font-medium rounded-lg",
              "transition-all duration-150 ease-out",
              "animate-in fade-in",
              originMap[placement],
              colorStyles[color],
            ].join(" ")}
            style={{ top: position.top, left: position.left, position: "absolute" }}
            onMouseEnter={() => clearTimeout(hideTimer.current)}
            onMouseLeave={hide}
          >
            {content}
            {showArrow && (
              <div
                className={`absolute w-2 h-2 rotate-45 ${arrowColorStyles[color]} ${arrowPlacement[placement]}`}
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
