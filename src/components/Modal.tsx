import React, {
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
type ModalBackdrop = "opaque" | "blur" | "transparent";
type ModalPlacement = "center" | "top" | "bottom";
type ScrollBehavior = "inside" | "outside";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  backdrop?: ModalBackdrop;
  placement?: ModalPlacement;
  isDismissable?: boolean;
  scrollBehavior?: ScrollBehavior;
  children?: ReactNode;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode | ((onClose: () => void) => ReactNode);
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full min-h-screen m-0 rounded-none",
};

const placementStyles: Record<ModalPlacement, string> = {
  center: "items-center",
  top: "items-start pt-16",
  bottom: "items-end pb-16",
};

const backdropStyles: Record<ModalBackdrop, string> = {
  opaque: "bg-black/50",
  blur: "bg-black/30 backdrop-blur-sm",
  transparent: "",
};

const ModalContext = React.createContext<{
  onClose: () => void;
  scrollBehavior: ScrollBehavior;
} | null>(null);

const useModalContext = () => {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("Modal compound components must be used within Modal");
  return ctx;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  backdrop = "opaque",
  placement = "center",
  isDismissable = true,
  scrollBehavior = "inside",
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDismissable) onClose();
    },
    [isDismissable, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, handleEscape]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && isDismissable) {
      onClose();
    }
  };

  if (!mounted) return null;

  const scrollOutside = scrollBehavior === "outside";

  return createPortal(
    <ModalContext.Provider value={{ onClose, scrollBehavior }}>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-50 transition-opacity duration-200",
          backdropStyles[backdrop],
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden="true"
      />
      {/* Container */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-0 z-50 flex justify-center",
          placementStyles[placement],
          scrollOutside ? "overflow-y-auto p-4" : "p-4",
        ].join(" ")}
        onClick={handleBackdropClick}
      >
        <div
          className={[
            "relative w-full bg-white rounded-2xl shadow-2xl shadow-black/10",
            "transition-all duration-200 ease-out",
            sizeStyles[size],
            scrollOutside ? "" : "max-h-[90vh] flex flex-col",
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2",
          ].join(" ")}
        >
          {typeof children === "function"
            ? (children as (onClose: () => void) => ReactNode)(onClose)
            : children}
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
      <div ref={ref} className={`flex flex-col flex-1 min-h-0 ${className}`} {...props}>
        {typeof children === "function" ? children(onClose) : children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    const { onClose } = useModalContext();
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between px-6 py-4 text-lg font-semibold text-default-800 ${className}`}
        {...props}
      >
        <div className="flex-1">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 p-1 rounded-full text-default-400 hover:text-default-600 hover:bg-default-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    const { scrollBehavior } = useModalContext();
    return (
      <div
        ref={ref}
        className={[
          "px-6 py-2 text-default-600",
          scrollBehavior === "inside" ? "flex-1 overflow-y-auto" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
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
    return (
      <div
        ref={ref}
        className={`flex items-center justify-end gap-2 px-6 py-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

export default Modal;
