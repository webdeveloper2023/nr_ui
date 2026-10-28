import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
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

type PopoverRadius = "none" | "sm" | "md" | "lg";
type PopoverBackdrop = "transparent" | "opaque" | "blur";

export interface PopoverProps {
  /** Open state (controlled) */
  isOpen?: boolean;
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement side */
  placement?: Placement;
  /** Distance from the trigger (px) */
  offset?: number;
  /** Shows the pointer arrow */
  showArrow?: boolean;
  /** Corner radius */
  radius?: PopoverRadius;
  /** Glass (blur) panel material; false gives a solid background */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Backdrop style */
  backdrop?: PopoverBackdrop;
  /** Close when focus leaves */
  shouldCloseOnBlur?: boolean;
  /** Closes on outside click */
  isDismissable?: boolean;
  /** PopoverTrigger and PopoverContent */
  children: ReactNode;
}

export interface PopoverTriggerProps {
  /** PopoverTrigger and PopoverContent */
  children: ReactElement;
}

export interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** PopoverTrigger and PopoverContent */
  children?: ReactNode | ((onClose: () => void) => ReactNode);
}

interface PopoverContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  placement: Placement;
  offset: number;
  showArrow: boolean;
  radius: PopoverRadius;
  isBlurred: boolean;
  material?: "frosted" | "liquid";
  backdrop: PopoverBackdrop;
  isDismissable: boolean;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopoverContext = () => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover compounds must be used within Popover");
  return ctx;
};

const radiusStyles: Record<PopoverRadius, string> = {
  none: "rounded-none",
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
};

const backdropStyles: Record<PopoverBackdrop, string> = {
  transparent: "",
  opaque: "bg-backdrop",
  blur: "bg-backdrop/50 backdrop-blur-sm",
};

export const Popover: React.FC<PopoverProps> = ({
  isOpen: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  showArrow = false,
  isBlurred = true,
  material,
  radius = "lg",
  backdrop = "transparent",
  isDismissable = true,
  children,
}) => {
  const [openState, setOpenState] = useState(defaultOpen);
  const isOpen = openProp ?? openState;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();

  const setIsOpen = useCallback(
    (open: boolean) => {
      setOpenState(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  return (
    <PopoverContext.Provider
      value={{ isOpen, setIsOpen, triggerRef, contentId, placement, offset, showArrow, radius, isBlurred, material, backdrop, isDismissable }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

Popover.displayName = "Popover";

type TriggerChildProps = { onClick?: (e: ReactMouseEvent) => void; ref?: unknown };

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen, triggerRef, contentId } = usePopoverContext();
  if (!isValidElement<TriggerChildProps>(children)) return children;
  const childProps = children.props;
  const childRef = (children as unknown as { ref?: unknown }).ref ?? childProps.ref;

  return React.cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      setRef(childRef, el);
    },
    onClick: (e: ReactMouseEvent) => {
      setIsOpen(!isOpen);
      childProps.onClick?.(e);
    },
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    "aria-controls": isOpen ? contentId : undefined,
  } as TriggerChildProps);
};

PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className = "", style, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerRef, contentId, placement, offset, showArrow, radius, isBlurred, material, backdrop, isDismissable } =
      usePopoverContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { mounted, visible } = usePresence(isOpen, 150);
    const floating = useFloating(mounted, triggerRef, contentRef, placement, offset);
    const side = getSide(floating.placement);
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);

    useEffect(() => {
      if (!isOpen) return;
      const onDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (isDismissable && !contentRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [isOpen, isDismissable, close, triggerRef]);

    if (!mounted) return null;

    return createPortal(
      <>
        {backdrop !== "transparent" && (
          <div
            aria-hidden
            className={cn(
              "fixed inset-0 z-40 transition-opacity duration-150",
              backdropStyles[backdrop],
              visible ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        <div
          ref={(el) => {
            contentRef.current = el;
            setRef(ref, el);
          }}
          id={contentId}
          role="dialog"
          data-glass={material}
          className={cn(
            "z-50 text-foreground",
            isBlurred ? "glass-thick" : "bg-overlay shadow-overlay",
            "transition-[opacity,transform] duration-150 ease-(--ease-out-soft)",
            radiusStyles[radius],
            originClass[side],
            visible ? "opacity-100 scale-100 translate-x-0 translate-y-0" : cn("opacity-0 scale-[0.96]", hiddenShift[side]),
            className
          )}
          style={{ ...floating.style, ...style }}
          {...props}
        >
          <div className="relative z-10">{typeof children === "function" ? children(close) : children}</div>
          {showArrow && (
            <span
              className={cn("absolute w-2.5 h-2.5 rotate-45", !isBlurred && "bg-overlay", arrowPosition(floating.placement))}
              style={isBlurred ? { backgroundColor: GLASS_THICK_BG, clipPath: arrowClipPath(floating.placement) } : undefined}
            />
          )}
        </div>
      </>,
      document.body
    );
  }
);

PopoverContent.displayName = "PopoverContent";

export default Popover;
