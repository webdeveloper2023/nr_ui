import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  createContext,
  useContext,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { useFloating, usePresence, getSide, originClass, hiddenShift, setRef, type Placement } from "./floating";

type DropdownColor = "default" | "accent" | "success" | "warning" | "danger";
type SelectionMode = "none" | "single" | "multiple";

export interface DropdownProps {
  /** DropdownTrigger va DropdownMenu */
  children: ReactNode;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Ochiq holati (boshqariladigan) */
  isOpen?: boolean;
  /** Boshlang'ich ochiq holati (boshqarilmaydigan) */
  defaultOpen?: boolean;
  /** Ochiq holati o'zgarganda chaqiriladi */
  onOpenChange?: (open: boolean) => void;
  /** Joylashuv tomoni */
  placement?: Placement;
  /** Trigger'dan masofa (px) */
  offset?: number;
  /** Element tanlanganda menyuni yopish */
  closeOnSelect?: boolean;
}

export interface DropdownTriggerProps {
  /** DropdownTrigger va DropdownMenu */
  children: ReactElement;
}

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** DropdownTrigger va DropdownMenu */
  children?: ReactNode;
  /** Ekran o'quvchilar uchun nom */
  "aria-label"?: string;
  /** Tanlash rejimi */
  selectionMode?: SelectionMode;
  /** Tanlangan kalitlar (boshqariladigan) */
  selectedKeys?: Set<string>;
  /** Boshlang'ich tanlangan kalitlar */
  defaultSelectedKeys?: Set<string>;
  /** Tanlov o'zgarganda chaqiriladi */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Element bosilganda chaqiriladi (kalit bilan) */
  onAction?: (key: string) => void;
  /** O'chirilgan elementlar kalitlari */
  disabledKeys?: Set<string>;
}

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  /** Elementning noyob kaliti */
  itemKey?: string;
  /** Boshidagi kontent (ikonka va h.k.) */
  startContent?: ReactNode;
  /** Oxiridagi kontent */
  endContent?: ReactNode;
  /** Qo'shimcha tavsif matni */
  description?: ReactNode;
  /** Klaviatura yorlig'i (o'ng tomonda) */
  shortcut?: ReactNode;
  /** Element rangi (masalan, danger) */
  color?: DropdownColor;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Pastida ajratuvchi chiziq ko'rsatish */
  showDivider?: boolean;
  /** DropdownTrigger va DropdownMenu */
  children?: ReactNode;
}

export interface DropdownSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Bo'lim sarlavhasi */
  title?: string;
  /** Pastida ajratuvchi chiziq ko'rsatish */
  showDivider?: boolean;
  /** DropdownTrigger va DropdownMenu */
  children?: ReactNode;
}

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  menuId: string;
  placement: Placement;
  offset: number;
  closeOnSelect: boolean;
}

interface MenuContextValue {
  selectionMode: SelectionMode;
  selectedKeys: Set<string>;
  disabledKeys?: Set<string>;
  select: (key: string) => void;
  onAction?: (key: string) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);
const MenuContext = createContext<MenuContextValue>({ selectionMode: "none", selectedKeys: new Set(), select: () => {} });

const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown compounds must be used within Dropdown");
  return ctx;
};

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  isDisabled = false,
  isOpen: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  offset = 6,
  closeOnSelect = true,
}) => {
  const [openState, setOpenState] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuId = useId();
  const isOpen = (openProp ?? openState) && !isDisabled;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (isDisabled) return;
      setOpenState(open);
      onOpenChange?.(open);
    },
    [isDisabled, onOpenChange]
  );

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef, menuId, placement, offset, closeOnSelect }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

Dropdown.displayName = "Dropdown";

type TriggerChildProps = {
  onClick?: (e: ReactMouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ref?: unknown;
};

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen, triggerRef, menuId } = useDropdownContext();
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
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      childProps.onKeyDown?.(e);
    },
    "aria-expanded": isOpen,
    "aria-haspopup": "menu",
    "aria-controls": isOpen ? menuId : undefined,
  } as TriggerChildProps);
};

DropdownTrigger.displayName = "DropdownTrigger";

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      children,
      className = "",
      selectionMode = "none",
      selectedKeys: selectedProp,
      defaultSelectedKeys,
      onSelectionChange,
      onAction,
      disabledKeys,
      ...props
    },
    ref
  ) => {
    const { isOpen, setIsOpen, triggerRef, menuId, placement, offset } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { mounted, visible } = usePresence(isOpen, 150);
    const floating = useFloating(mounted, triggerRef, menuRef, placement, offset, true);
    const side = getSide(floating.placement);
    const [selectedState, setSelectedState] = useState<Set<string>>(defaultSelectedKeys ?? new Set());
    const selectedKeys = selectedProp ?? selectedState;

    const select = useCallback(
      (key: string) => {
        if (selectionMode === "none") return;
        const next = new Set(selectionMode === "single" ? [] : selectedKeys);
        if (selectedKeys.has(key)) next.delete(key);
        else next.add(key);
        setSelectedState(next);
        onSelectionChange?.(next);
      },
      [selectionMode, selectedKeys, onSelectionChange]
    );

    // Click outside
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setIsOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, setIsOpen, triggerRef]);

    const getItems = useCallback(
      (): HTMLButtonElement[] =>
        menuRef.current
          ? Array.from(menuRef.current.querySelectorAll<HTMLButtonElement>('button[role^="menuitem"]:not(:disabled)'))
          : [],
      []
    );

    // Focus first item on open, keyboard navigation
    useEffect(() => {
      if (!isOpen) return;
      const raf = requestAnimationFrame(() => menuRef.current?.focus());

      const handler = (e: KeyboardEvent) => {
        const items = getItems();
        if (!items.length) return;
        const idx = items.indexOf(document.activeElement as HTMLButtonElement);
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            items[(idx + 1) % items.length]?.focus();
            break;
          case "ArrowUp":
            e.preventDefault();
            items[idx <= 0 ? items.length - 1 : idx - 1]?.focus();
            break;
          case "Home":
            e.preventDefault();
            items[0]?.focus();
            break;
          case "End":
            e.preventDefault();
            items[items.length - 1]?.focus();
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
      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("keydown", handler);
      };
    }, [isOpen, setIsOpen, triggerRef, getItems]);

    if (!mounted) return null;

    return createPortal(
      <MenuContext.Provider value={{ selectionMode, selectedKeys, disabledKeys, select, onAction }}>
        <div
          ref={(el) => {
            menuRef.current = el;
            setRef(ref, el);
          }}
          id={menuId}
          role="menu"
          tabIndex={-1}
          className={cn(
            "z-50 min-w-[220px] max-h-[min(24rem,calc(100vh-2rem))] overflow-y-auto p-1.5 outline-none",
            "bg-overlay text-foreground rounded-2xl shadow-overlay",
            "transition-[opacity,transform] duration-150 ease-(--ease-out-soft)",
            originClass[side],
            visible ? "opacity-100 scale-100 translate-x-0 translate-y-0" : cn("opacity-0 scale-[0.96]", hiddenShift[side]),
            className
          )}
          style={floating.style}
          {...props}
        >
          {children}
        </div>
      </MenuContext.Provider>,
      document.body
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

const itemColorStyles: Record<DropdownColor, string> = {
  default: "text-foreground hover:bg-default focus:bg-default",
  accent: "text-foreground hover:bg-accent-soft hover:text-accent-soft-foreground focus:bg-accent-soft focus:text-accent-soft-foreground",
  success: "text-foreground hover:bg-success-soft hover:text-success-soft-foreground focus:bg-success-soft focus:text-success-soft-foreground",
  warning: "text-foreground hover:bg-warning-soft hover:text-warning-soft-foreground focus:bg-warning-soft focus:text-warning-soft-foreground",
  danger: "text-danger hover:bg-danger-soft focus:bg-danger-soft",
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      itemKey,
      startContent,
      endContent,
      description,
      shortcut,
      color = "default",
      isDisabled = false,
      showDivider = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const { setIsOpen, triggerRef, closeOnSelect } = useDropdownContext();
    const { selectionMode, selectedKeys, disabledKeys, select, onAction } = useContext(MenuContext);
    const fallbackKey = useId();
    const key = itemKey ?? fallbackKey;
    const disabled = isDisabled || Boolean(disabledKeys?.has(key));
    const isSelected = selectionMode !== "none" && selectedKeys.has(key);

    const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      select(key);
      onAction?.(key);
      if (closeOnSelect && selectionMode !== "multiple") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const role = selectionMode === "single" ? "menuitemradio" : selectionMode === "multiple" ? "menuitemcheckbox" : "menuitem";

    return (
      <>
        <button
          ref={ref}
          type="button"
          role={role}
          aria-checked={selectionMode !== "none" ? isSelected : undefined}
          disabled={disabled}
          onClick={handleClick}
          onMouseEnter={(e) => e.currentTarget.focus({ preventScroll: true })}
          className={cn(
            "group w-full flex items-center gap-2.5 px-2.5 py-1.5 min-h-9 text-sm text-left rounded-xl",
            "outline-none transition-colors duration-100 cursor-pointer select-none",
            itemColorStyles[color],
            disabled && "opacity-40 pointer-events-none",
            className
          )}
          {...props}
        >
          {startContent && (
            <span className={cn("flex-shrink-0 flex items-center", color === "default" ? "text-muted group-hover:text-foreground group-focus:text-foreground" : "")}>
              {startContent}
            </span>
          )}
          <span className="flex-1 min-w-0">
            <span className="block truncate font-medium">{children}</span>
            {description && <span className="block text-xs text-muted mt-0.5 truncate font-normal">{description}</span>}
          </span>
          {shortcut && (
            <kbd className="flex-shrink-0 font-sans text-xs text-muted">
              {shortcut}
            </kbd>
          )}
          {endContent && <span className="flex-shrink-0 text-muted">{endContent}</span>}
          {selectionMode !== "none" && (
            <span className={cn("flex-shrink-0 text-accent transition-opacity", isSelected ? "opacity-100" : "opacity-0")}>
              <CheckIcon />
            </span>
          )}
        </button>
        {showDivider && <div role="separator" className="my-1.5 mx-1 h-px bg-separator" />}
      </>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

export const DropdownSection: React.FC<DropdownSectionProps> = ({
  title,
  showDivider = false,
  children,
  className = "",
  ...props
}) => (
  <div role="group" aria-label={title} className={cn("py-0.5", className)} {...props}>
    {title && <div className="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted">{title}</div>}
    {children}
    {showDivider && <div role="separator" className="my-1.5 mx-1 h-px bg-separator" />}
  </div>
);

DropdownSection.displayName = "DropdownSection";

export default Dropdown;
