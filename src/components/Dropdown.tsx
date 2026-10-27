import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

type DropdownColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export interface DropdownProps {
  children: ReactNode;
  isDisabled?: boolean;
}

export interface DropdownTriggerProps {
  children: ReactElement;
}

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  "aria-label"?: string;
}

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  description?: string;
  color?: DropdownColor;
  isDisabled?: boolean;
  children?: ReactNode;
}

export interface DropdownSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: ReactNode;
}

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown compounds must be used within Dropdown");
  return ctx;
};

export const Dropdown: React.FC<DropdownProps> = ({ children, isDisabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <DropdownContext.Provider
      value={{
        isOpen: isDisabled ? false : isOpen,
        setIsOpen: isDisabled ? () => {} : setIsOpen,
        triggerRef,
      }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.displayName = "Dropdown";

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdownContext();

  const child = React.cloneElement(children, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      setIsOpen(!isOpen);
      children.props.onClick?.(e);
    },
    "aria-expanded": isOpen,
    "aria-haspopup": "menu",
  } as Record<string, unknown>);

  return child;
};

DropdownTrigger.displayName = "DropdownTrigger";

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className = "", ...props }, ref) => {
    const { isOpen, setIsOpen, triggerRef } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, minWidth: 0 });
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const focusIndex = useRef(-1);

    useEffect(() => {
      if (isOpen) {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } else {
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), 150);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 4 + window.scrollY,
          left: rect.left + window.scrollX,
          minWidth: rect.width,
        });
      }
    }, [isOpen, triggerRef]);

    // Click outside
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          menuRef.current &&
          !menuRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, setIsOpen, triggerRef]);

    // Keyboard navigation
    const getItems = useCallback((): HTMLButtonElement[] => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLButtonElement>(
          'button[role="menuitem"]:not(:disabled)'
        )
      );
    }, []);

    useEffect(() => {
      if (!isOpen) {
        focusIndex.current = -1;
        return;
      }

      const handler = (e: KeyboardEvent) => {
        const items = getItems();
        if (!items.length) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            focusIndex.current = Math.min(focusIndex.current + 1, items.length - 1);
            items[focusIndex.current]?.focus();
            break;
          case "ArrowUp":
            e.preventDefault();
            focusIndex.current = Math.max(focusIndex.current - 1, 0);
            items[focusIndex.current]?.focus();
            break;
          case "Escape":
            setIsOpen(false);
            triggerRef.current?.focus();
            break;
          case "Tab":
            setIsOpen(false);
            break;
        }
      };

      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [isOpen, setIsOpen, triggerRef, getItems]);

    if (!mounted) return null;

    return createPortal(
      <div
        ref={(el) => {
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        role="menu"
        className={[
          "absolute z-50 min-w-[160px] py-1",
          "bg-white rounded-xl shadow-xl shadow-black/10 border border-default-100",
          "transition-all duration-150 ease-out origin-top-left",
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1",
          className,
        ].join(" ")}
        style={{
          top: position.top,
          left: position.left,
          minWidth: position.minWidth,
        }}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

const itemColorStyles: Record<DropdownColor, string> = {
  default: "hover:bg-default-100 text-default-700",
  primary: "hover:bg-primary-50 text-primary-500",
  secondary: "hover:bg-primary-50 text-primary-300",
  success: "hover:bg-success-500/10 text-success-500",
  warning: "hover:bg-warning-500/10 text-warning-500",
  danger: "hover:bg-danger-500/10 text-danger-500",
};

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      startContent,
      endContent,
      description,
      color = "default",
      isDisabled = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const { setIsOpen } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setIsOpen(false);
    };

    return (
      <button
        ref={ref}
        role="menuitem"
        disabled={isDisabled}
        onClick={handleClick}
        className={[
          "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
          "outline-none transition-colors duration-100 cursor-pointer",
          "focus-visible:bg-default-100",
          itemColorStyles[color],
          isDisabled ? "opacity-50 pointer-events-none" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {startContent && <span className="flex-shrink-0">{startContent}</span>}
        <div className="flex-1 min-w-0">
          <div>{children}</div>
          {description && (
            <div className="text-xs text-default-400 mt-0.5">{description}</div>
          )}
        </div>
        {endContent && <span className="flex-shrink-0 text-default-400">{endContent}</span>}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

export const DropdownSection: React.FC<DropdownSectionProps> = ({
  title,
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      role="group"
      className={`${className}`}
      {...props}
    >
      {title && (
        <div className="px-3 pt-2 pb-1 text-xs font-semibold text-default-400 uppercase tracking-wider">
          {title}
        </div>
      )}
      {children}
      <div className="my-1 border-b border-default-100 last:hidden" />
    </div>
  );
};

DropdownSection.displayName = "DropdownSection";

export default Dropdown;
