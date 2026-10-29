import { Children, createContext, isValidElement, useContext, useState, type ReactElement, type ReactNode } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useBreakpoint, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type SidebarVariant = "default" | "surface";

interface SidebarContextValue {
  isCollapsed: boolean;
  variant: SidebarVariant;
  selectedKey?: string;
  onSelect?: (key: string) => void;
  bps: Breakpoint[];
}

const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false, variant: "default", bps: [] });

// Mobile: a full-width panel (for a drawer / sheet), never a rail. Tablet: starts as an icon rail.
// Desktop: a wider panel. Items are touch-sized on mobile and tablet.
const asideR: BreakpointClasses = { m: "mobile:w-full", d: "desktop:w-72" };
const itemR: BreakpointClasses = { m: "mobile:h-11 mobile:text-base", t: "tablet:h-10" };

export interface SidebarProps {
  /** Style: transparent on the canvas or a white surface panel */
  variant?: SidebarVariant;
  /** Collapsed state (controlled) */
  isCollapsed?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Called when the collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Selected item key (controlled) */
  selectedKey?: string;
  /** Initially selected key */
  defaultSelectedKey?: string;
  /** Called when an item is selected */
  onSelect?: (key: string) => void;
  /** Header (logo, etc.) */
  header?: ReactNode;
  /** Footer (profile, etc.) */
  footer?: ReactNode;
  /** Hides the collapse button */
  hideToggle?: boolean;
  /** Makes the panel glass — for colorful backgrounds or images */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Adapts to the screen: full width with touch-sized items and no collapse button on mobile (place it in a drawer), starts as an icon rail on tablet (the toggle still expands it), wider (288px) on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Child items */
  children?: ReactNode;
  /** Extra CSS classes */
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
  responsive,
  children,
  className = "",
}: SidebarProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const bp = useBreakpoint();
  const isAuto = bps.includes(bp);
  // null = not toggled yet: follows defaultCollapsed, or the icon rail on tablet
  const [collapsedState, setCollapsedState] = useState<boolean | null>(null);
  const [selectedState, setSelectedState] = useState(defaultSelectedKey);
  const isMobilePanel = isAuto && bp === "m";
  const isCollapsed = isMobilePanel ? false : (collapsedProp ?? collapsedState ?? (isAuto && bp === "t" ? true : defaultCollapsed));
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
    <SidebarContext.Provider value={{ isCollapsed, variant, selectedKey, onSelect: select, bps }}>
      <aside
        data-glass={material}
        className={cn(
          "flex flex-col h-full text-foreground",
          "transition-[width] duration-300 ease-(--ease-out-soft)",
          isBlurred ? "glass rounded-3xl" : variant === "surface" ? "bg-surface-gradient shadow-surface rounded-3xl" : "bg-transparent",
          isCollapsed ? "w-16" : cn("w-64", rx(bps, asideR)),
          className
        )}
      >
        <div className={cn("flex items-center h-16 shrink-0 gap-2", isCollapsed ? "justify-center px-2" : "justify-between px-4")}>
          {!isCollapsed && <div className="min-w-0 flex-1 animate-fade-in">{header}</div>}
          {!hideToggle && !isMobilePanel && (
            <button
              onClick={toggle}
              className={cn(
                "flex items-center justify-center w-8 h-8 shrink-0 rounded-full text-muted cursor-pointer",
                "hover:bg-default hover:text-foreground transition-colors duration-150",
                focusRing
              )}
              aria-label={isCollapsed ? t.sidebar.expand : t.sidebar.collapse}
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
  /** Section name */
  title?: string;
  /** Child items */
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
  /** Unique item key */
  itemKey: string;
  /** Icon */
  icon?: ReactNode;
  /** Item title */
  title: string;
  /** Link (renders an <a> when set) */
  href?: string;
  /** Content on the right (badge, etc.) */
  endContent?: ReactNode;
  /** Nested items */
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
  const { isCollapsed, variant, selectedKey, onSelect, bps } = useContext(SidebarContext);
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
    rx(bps, itemR),
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
