import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { usePresence } from "./floating";
import { getTabbable } from "../lib/focus";
import { rx, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
type ModalBackdrop = "opaque" | "blur" | "transparent";
type ModalPlacement = "auto" | "center" | "top" | "bottom";
type ModalRadius = "none" | "sm" | "md" | "lg";
type ScrollBehavior = "inside" | "outside" | "normal";

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when closed */
  onClose: () => void;
  /** Modal width */
  size?: ModalSize;
  /** Corner radius */
  radius?: ModalRadius;
  /** Backdrop style */
  backdrop?: ModalBackdrop;
  /** Glass (blur) dialog material; false gives a solid background */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Position on screen (auto: bottom sheet on mobile) */
  placement?: ModalPlacement;
  /** Closes on outside click */
  isDismissable?: boolean;
  /** Disables closing with Escape */
  isKeyboardDismissDisabled?: boolean;
  /** Hides the close (X) button */
  hideCloseButton?: boolean;
  /** Where scrolling happens for long content */
  scrollBehavior?: ScrollBehavior;
  /** Adapts to the screen: a full-width bottom sheet on mobile (rounded top, grab handle, up to 90% height, scrolling body, stacked full-width footer buttons, touch-sized close); a centered dialog up to the screen width on tablet; roomier padding and 16px text on desktop. Ignored for size "full". true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
  /** Content, or a (onClose) => content function */
  children?: ReactNode | ((onClose: () => void) => ReactNode);
  /** Accessible name for a modal without a ModalHeader (a ModalHeader is linked automatically) */
  "aria-label"?: string;
  /** Id of the element that names the dialog (overrides the automatic ModalHeader link) */
  "aria-labelledby"?: string;
  /** Id of the element that describes the dialog */
  "aria-describedby"?: string;
}

export interface ModalContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Content, or a (onClose) => content function */
  children?: ReactNode | ((onClose: () => void) => ReactNode);
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content */
  children?: ReactNode;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Main content */
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer (usually buttons) */
  children?: ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  full: "max-w-full h-[100dvh] !rounded-none !m-0",
};

const radiusStyles: Record<ModalRadius, string> = {
  none: "rounded-none",
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
};

const placementStyles: Record<ModalPlacement, string> = {
  auto: "items-end sm:items-center",
  center: "items-center",
  top: "items-start",
  bottom: "items-end",
};

const backdropStyles: Record<ModalBackdrop, string> = {
  opaque: "bg-backdrop",
  blur: "bg-backdrop backdrop-blur-md",
  transparent: "bg-transparent",
};

// ── Responsive ──
// Mobile: bottom sheet for every placement. Tablet: centered, capped at the screen width. Desktop: roomier.
const overlayR: BreakpointClasses = {
  m: "mobile:items-end mobile:p-0",
  t: "tablet:items-center tablet:p-8",
};
const dialogR: BreakpointClasses = {
  m: "mobile:max-w-none mobile:rounded-b-none mobile:max-h-[90dvh] mobile:pb-[env(safe-area-inset-bottom)]",
  t: "tablet:max-w-[calc(100vw-4rem)] tablet:max-h-[calc(100dvh-4rem)]",
};
// Hidden state: slide up from the bottom edge on mobile
const dialogHiddenR: BreakpointClasses = { m: "mobile:translate-y-8 mobile:scale-100" };
const handleR: BreakpointClasses = { m: "mobile:block" };
const closeR: BreakpointClasses = {
  m: "mobile:top-3 mobile:right-3 mobile:h-10 mobile:w-10",
  t: "tablet:h-10 tablet:w-10",
  d: "desktop:top-6 desktop:right-6",
};
const headerR: BreakpointClasses = { m: "mobile:px-5 mobile:pt-5", d: "desktop:px-8 desktop:pt-8 desktop:pr-16 desktop:text-xl" };
const bodyR: BreakpointClasses = { m: "mobile:px-5", d: "desktop:px-8 desktop:py-3 desktop:text-base" };
const footerR: BreakpointClasses = {
  m: "mobile:flex-col-reverse mobile:items-stretch mobile:px-5 mobile:pb-5 mobile:[&>*]:w-full",
  d: "desktop:px-8 desktop:pb-8 desktop:gap-3",
};

const ModalContext = React.createContext<{
  onClose: () => void;
  bps: Breakpoint[];
  scrollBehavior: ScrollBehavior;
  titleId: string;
  setHeaderId: (id: string | null) => void;
} | null>(null);

const useModalContext = () => {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("Modal compound components must be used within Modal");
  return ctx;
};

let scrollLocks = 0;
/** Open modals, innermost last — only the top one handles the keyboard */
const modalStack: object[] = [];

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  radius = "lg",
  backdrop = "opaque",
  isBlurred = true,
  material,
  placement = "auto",
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  hideCloseButton = false,
  scrollBehavior = "inside",
  responsive,
  className = "",
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}) => {
  const t = useLocale();
  const responsiveBps = useResponsive(responsive);
  const titleId = useId();
  const [headerId, setHeaderId] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const { mounted, visible } = usePresence(isOpen, 200);

  // Escape, focus trap, scroll lock, focus restore
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const token = {};
    modalStack.push(token);

    scrollLocks++;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const raf = requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const first = getTabbable(dialog).find((el) => !el.hasAttribute("data-close-button"));
      (first ?? dialog).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      // Nested modals: only the innermost one reacts; keys already handled by a child (e.g. an open Select) are skipped
      if (!dialog || modalStack[modalStack.length - 1] !== token || e.defaultPrevented) return;
      if (e.key === "Escape") {
        if (isDismissable && !isKeyboardDismissDisabled) {
          e.preventDefault();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getTabbable(dialog);
      const active = document.activeElement as HTMLElement | null;
      // Nothing to tab to — keep focus on the dialog itself
      if (!nodes.length) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const inside = !!active && dialog.contains(active) && active !== dialog;
      if (e.shiftKey ? !inside || active === first : !inside || active === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      modalStack.splice(modalStack.indexOf(token), 1);
      scrollLocks--;
      if (scrollLocks === 0) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
      previouslyFocused?.focus?.();
    };
  }, [isOpen, isDismissable, isKeyboardDismissDisabled]);

  if (!mounted) return null;

  const scrollOutside = scrollBehavior === "outside";
  const isFull = size === "full";
  const fromBottom = placement === "bottom" || placement === "auto";
  // A full-screen modal is already full-screen everywhere
  const bps = isFull ? [] : responsiveBps;

  return createPortal(
    <ModalContext.Provider value={{ onClose, bps, scrollBehavior, titleId, setHeaderId }}>
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-200 ease-out",
          backdropStyles[backdrop],
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-50 flex justify-center",
          placementStyles[placement],
          !isFull && "sm:p-6",
          !isFull && placement === "top" && "p-4",
          !isFull && placement === "center" && "p-4",
          scrollOutside ? "overflow-y-auto" : "overflow-hidden",
          rx(bps, overlayR)
        )}
        onMouseDown={(e) => {
          if (e.target === overlayRef.current && isDismissable) onClose();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : headerId ?? undefined)}
          aria-describedby={ariaDescribedBy}
          data-glass={material}
          tabIndex={-1}
          className={cn(
            "relative w-full flex flex-col text-foreground outline-none",
            isBlurred ? "glass-thick" : "bg-overlay shadow-overlay",
            "transition-[opacity,transform] duration-200 ease-(--ease-out-soft)",
            radiusStyles[radius],
            fromBottom && !isFull && "max-sm:rounded-b-none",
            sizeStyles[size],
            scrollOutside ? "my-auto" : !isFull && "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-6rem)]",
            rx(bps, dialogR),
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : cn("opacity-0", fromBottom ? "max-sm:translate-y-8 sm:scale-[0.96]" : "scale-[0.96] translate-y-2", rx(bps, dialogHiddenR)),
            className
          )}
        >
          {bps.includes("m") && (
            <span aria-hidden className={cn("hidden mx-auto mt-2 -mb-1 h-1 w-9 shrink-0 rounded-full bg-foreground/20", rx(bps, handleR))} />
          )}
          {!hideCloseButton && (
            <button
              type="button"
              data-close-button
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer",
                "bg-default text-muted hover:bg-default-hover hover:text-foreground active:scale-[0.95] transition-[color,background-color,transform]",
                "outline-none focus-visible:ring-2 focus-visible:ring-focus",
                rx(bps, closeR)
              )}
              aria-label={t.common.close}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {typeof children === "function" ? children(onClose) : children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

Modal.displayName = "Modal";

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className = "", ...props }, ref) => {
    const { onClose } = useModalContext();
    return (
      <div ref={ref} className={cn("flex flex-col flex-1 min-h-0", className)} {...props}>
        {typeof children === "function" ? children(onClose) : children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className = "", id, ...props }, ref) => {
    const { titleId, setHeaderId, bps } = useModalContext();
    const headerId = id ?? titleId;
    // Names the dialog: <Modal> points aria-labelledby at this header
    useLayoutEffect(() => {
      setHeaderId(headerId);
      return () => setHeaderId(null);
    }, [headerId, setHeaderId]);
    return (
      <div
        ref={ref}
        id={headerId}
        className={cn("flex flex-col gap-1 px-6 pt-6 pb-2 pr-14 text-lg font-semibold leading-7 text-foreground", rx(bps, headerR), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    const { scrollBehavior, bps } = useModalContext();
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 px-6 py-2 text-sm leading-6 text-muted",
          scrollBehavior === "inside" && "flex-1 overflow-y-auto",
          rx(bps, bodyR),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = "ModalBody";

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    const bps = React.useContext(ModalContext)?.bps ?? [];
    return (
      <div
        ref={ref}
        className={cn("flex flex-row items-center justify-end gap-2 px-6 pt-4 pb-6", rx(bps, footerR), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default Modal;
