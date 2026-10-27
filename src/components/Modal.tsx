import React, {
  useEffect,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { usePresence } from "./floating";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
type ModalBackdrop = "opaque" | "blur" | "transparent";
type ModalPlacement = "auto" | "center" | "top" | "bottom";
type ModalRadius = "none" | "sm" | "md" | "lg";
type ScrollBehavior = "inside" | "outside" | "normal";

export interface ModalProps {
  /** Modal ochiqmi */
  isOpen: boolean;
  /** Yopilganda chaqiriladi */
  onClose: () => void;
  /** Modal kengligi */
  size?: ModalSize;
  /** Burchak yumaloqligi */
  radius?: ModalRadius;
  /** Orqa fon turi */
  backdrop?: ModalBackdrop;
  /** Ekrandagi joylashuv (auto — mobilda pastdan) */
  placement?: ModalPlacement;
  /** Tashqariga bosilganda yopilishi */
  isDismissable?: boolean;
  /** Escape bilan yopilishni o'chirish */
  isKeyboardDismissDisabled?: boolean;
  /** Yopish (X) tugmasini yashirish */
  hideCloseButton?: boolean;
  /** Uzun kontentda scroll qayerda bo'lishi */
  scrollBehavior?: ScrollBehavior;
  /** Qo'shimcha CSS klasslar */
  className?: string;
  /** Kontent yoki (onClose) => kontent funksiyasi */
  children?: ReactNode | ((onClose: () => void) => ReactNode);
}

export interface ModalContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Kontent yoki (onClose) => kontent funksiyasi */
  children?: ReactNode | ((onClose: () => void) => ReactNode);
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Sarlavha kontenti */
  children?: ReactNode;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Asosiy kontent */
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Pastki qism (odatda tugmalar) */
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
  blur: "bg-backdrop backdrop-blur-sm",
  transparent: "bg-transparent",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ModalContext = React.createContext<{
  onClose: () => void;
  scrollBehavior: ScrollBehavior;
} | null>(null);

const useModalContext = () => {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("Modal compound components must be used within Modal");
  return ctx;
};

let scrollLocks = 0;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  radius = "lg",
  backdrop = "opaque",
  placement = "auto",
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  hideCloseButton = false,
  scrollBehavior = "inside",
  className = "",
  children,
}) => {
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

    scrollLocks++;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const raf = requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const first = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).find(
        (el) => !el.hasAttribute("data-close-button")
      );
      (first ?? dialog).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDismissable && !isKeyboardDismissDisabled) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
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

  return createPortal(
    <ModalContext.Provider value={{ onClose, scrollBehavior }}>
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
          scrollOutside ? "overflow-y-auto" : "overflow-hidden"
        )}
        onMouseDown={(e) => {
          if (e.target === overlayRef.current && isDismissable) onClose();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn(
            "relative w-full flex flex-col bg-overlay text-foreground shadow-overlay outline-none",
            "transition-[opacity,transform] duration-200 ease-(--ease-out-soft)",
            radiusStyles[radius],
            fromBottom && !isFull && "max-sm:rounded-b-none",
            sizeStyles[size],
            scrollOutside ? "my-auto" : !isFull && "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-6rem)]",
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : cn("opacity-0", fromBottom ? "max-sm:translate-y-8 sm:scale-[0.96]" : "scale-[0.96] translate-y-2"),
            className
          )}
        >
          {!hideCloseButton && (
            <button
              type="button"
              data-close-button
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer",
                "bg-default text-muted hover:bg-default-hover hover:text-foreground active:scale-[0.95] transition-[color,background-color,transform]",
                "outline-none focus-visible:ring-2 focus-visible:ring-focus"
              )}
              aria-label="Close"
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
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1 px-6 pt-6 pb-2 pr-14 text-lg font-semibold leading-7 text-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = "ModalHeader";

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    const { scrollBehavior } = useModalContext();
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 px-6 py-2 text-sm leading-6 text-muted",
          scrollBehavior === "inside" && "flex-1 overflow-y-auto",
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
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-row items-center justify-end gap-2 px-6 pt-4 pb-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = "ModalFooter";

export default Modal;
