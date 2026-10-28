import { Children, createContext, isValidElement, useContext, useState, type ReactElement, type ReactNode } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/cn";

type SidebarVariant = "default" | "surface";

interface SidebarContextValue {
  isCollapsed: boolean;
  variant: SidebarVariant;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false, variant: "default" });

export interface SidebarProps {
  /** Ko'rinish: canvas ustida shaffof yoki oq surface panel */
  variant?: SidebarVariant;
  /** Yig'ilgan holat (boshqariladigan) */
  isCollapsed?: boolean;
  /** Boshlang'ich yig'ilgan holat */
  defaultCollapsed?: boolean;
  /** Yig'ilish holati o'zgarganda chaqiriladi */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Tanlangan element kaliti (boshqariladigan) */
  selectedKey?: string;
  /** Boshlang'ich tanlangan kalit */
  defaultSelectedKey?: string;
  /** Element tanlanganda chaqiriladi */
  onSelect?: (key: string) => void;
  /** Yuqori qism (logo va h.k.) */
  header?: ReactNode;
  /** Pastki qism (profil va h.k.) */
  footer?: ReactNode;
  /** Yig'ish tugmasini yashirish */
  hideToggle?: boolean;
  /** Panelni shisha (glass) qiladi — rangli fon yoki rasm ustida */
  isBlurred?: boolean;
  /** Shisha materiali: frosted (klassik) yoki liquid (clear glass Liquid). Berilmasa global sozlama (html data-glass) ishlatiladi */
  material?: "frosted" | "liquid";
  /** Ichki elementlar */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Sidebar({
  variant = "default",
  isCollapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  selectedKey: selectedProp,
  defaultSelectedKey,
  onSelect,
  header,
  footer,
  hideToggle = false,
  isBlurred = false,
  material,
  children,
  className = "",
}: SidebarProps) {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const [selectedState, setSelectedState] = useState(defaultSelectedKey);
  const isCollapsed = collapsedProp ?? collapsedState;
  const selectedKey = selectedProp ?? selectedState;

  const toggle = () => {
    setCollapsedState(!isCollapsed);
    onCollapsedChange?.(!isCollapsed);
  };

  const select = (key: string) => {
    setSelectedState(key);
    onSelect?.(key);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, variant, selectedKey, onSelect: select }}>
      <aside
        data-glass={material}
        className={cn(
          "flex flex-col h-full text-foreground",
          "transition-[width] duration-300 ease-(--ease-out-soft)",
          isBlurred ? "glass rounded-3xl" : variant === "surface" ? "bg-surface-gradient shadow-surface rounded-3xl" : "bg-transparent",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className={cn("flex items-center h-16 shrink-0 gap-2", isCollapsed ? "justify-center px-2" : "justify-between px-4")}>
          {!isCollapsed && <div className="min-w-0 flex-1 animate-fade-in">{header}</div>}
          {!hideToggle && (
            <button
              onClick={toggle}
              className={cn(
                "flex items-center justify-center w-8 h-8 shrink-0 rounded-full text-muted cursor-pointer",
                "hover:bg-default hover:text-foreground transition-colors duration-150",
                focusRing
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
          )}
        </div>
        <nav className={cn("flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-5", isCollapsed ? "px-2" : "px-3")}>{children}</nav>
        {footer && <div className={cn("border-t border-separator", isCollapsed ? "p-2" : "p-3")}>{footer}</div>}
      </aside>
    </SidebarContext.Provider>
  );
}

export interface SidebarSectionProps {
  /** Bo'lim nomi */
  title?: string;
  /** Ichki elementlar */
  children?: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  const { isCollapsed } = useContext(SidebarContext);
  return (
    <div>
      {title && !isCollapsed && <p className="px-3 mb-1.5 text-xs font-medium text-muted">{title}</p>}
      {title && isCollapsed && <div className="mx-auto mb-2 w-5 h-px bg-separator" />}
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

export interface SidebarItemProps {
  /** Elementning noyob kaliti */
  itemKey: string;
  /** Ikonka */
  icon?: ReactNode;
  /** Element nomi */
  title: string;
  /** Havola (berilsa <a> sifatida chiqadi) */
  href?: string;
  /** O'ng tomondagi kontent (badge va h.k.) */
  endContent?: ReactNode;
  /** Ichki (nested) elementlar */
  children?: ReactNode;
}

function containsKey(children: ReactNode, key?: string): boolean {
  if (!key) return false;
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    const props = (child as ReactElement<SidebarItemProps>).props;
    return props.itemKey === key || containsKey(props.children, key);
  });
}

export function SidebarItem({ itemKey, icon, title, href, endContent, children }: SidebarItemProps) {
  const { isCollapsed, variant, selectedKey, onSelect } = useContext(SidebarContext);
  const hasChildren = Boolean(children);
  const hasSelectedChild = hasChildren && containsKey(children, selectedKey);
  const [isOpen, setIsOpen] = useState(hasSelectedChild);
  const isSelected = selectedKey === itemKey;

  // Auto-open when a nested item becomes selected (state adjusted during render).
  const [prevHasSelectedChild, setPrevHasSelectedChild] = useState(hasSelectedChild);
  if (hasSelectedChild !== prevHasSelectedChild) {
    setPrevHasSelectedChild(hasSelectedChild);
    if (hasSelectedChild) setIsOpen(true);
  }

  const classes = cn(
    "relative flex items-center w-full h-9 rounded-xl text-sm cursor-pointer select-none",
    "transition-colors duration-150",
    focusRing,
    isCollapsed ? "justify-center px-0" : "gap-2.5 px-3",
    isSelected
      ? variant === "surface"
        ? "bg-default text-foreground font-medium"
        : "bg-surface shadow-surface text-foreground font-medium"
      : hasSelectedChild
        ? "text-foreground"
        : "text-muted hover:bg-default/70 hover:text-foreground"
  );

  const content = (
    <>
      {icon && <span className={cn("shrink-0 flex items-center", isSelected ? "text-foreground" : "text-current")}>{icon}</span>}
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left truncate">{title}</span>
          {endContent}
          {hasChildren && (
            <ChevronDown size={15} className={cn("text-muted transition-transform duration-200", isOpen && "rotate-180")} />
          )}
        </>
      )}
    </>
  );

  const handleClick = () => (hasChildren ? setIsOpen(!isOpen) : onSelect?.(itemKey));

  return (
    <li className="relative group">
      {href && !hasChildren ? (
        <a href={href} onClick={handleClick} className={classes} aria-current={isSelected ? "page" : undefined}>
          {content}
        </a>
      ) : (
        <button
          onClick={handleClick}
          className={classes}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-current={isSelected ? "page" : undefined}
          aria-label={isCollapsed ? title : undefined}
        >
          {content}
        </button>
      )}
      {isCollapsed && (
        <span
          className={cn(
            "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap",
            "rounded-xl bg-overlay px-2.5 py-1.5 text-xs font-medium text-foreground shadow-overlay",
            "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150"
          )}
        >
          {title}
        </span>
      )}
      {hasChildren && !isCollapsed && (
        <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-out-soft)", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <ul className="ml-[22px] mt-0.5 pl-2.5 border-l border-separator space-y-0.5">{children}</ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default Sidebar;
