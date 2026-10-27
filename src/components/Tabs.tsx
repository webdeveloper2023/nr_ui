import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from "react";

type TabsVariant = "solid" | "bordered" | "light" | "underlined";
type TabsColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type TabsSize = "sm" | "md" | "lg";
type TabsRadius = "none" | "sm" | "md" | "lg" | "full";

export interface TabItem {
  key: string;
  title: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;
  radius?: TabsRadius;
  fullWidth?: boolean;
  tabs: TabItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  children?: (key: string) => ReactNode;
}

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  tabKey: string;
  title: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
}

interface TabsContextValue {
  selectedKey: string;
  variant: TabsVariant;
  color: TabsColor;
  size: TabsSize;
  onSelect: (key: string) => void;
  registerTab: (key: string, el: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const sizeStyles: Record<TabsSize, string> = {
  sm: "text-xs h-8 px-3",
  md: "text-sm h-10 px-4",
  lg: "text-base h-12 px-5",
};

const colorValues: Record<TabsColor, { bg: string; text: string; indicator: string }> = {
  default: {
    bg: "bg-default-200",
    text: "text-default-700",
    indicator: "bg-default-800",
  },
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-500",
    indicator: "bg-primary-500",
  },
  secondary: {
    bg: "bg-primary-50",
    text: "text-primary-300",
    indicator: "bg-primary-300",
  },
  success: {
    bg: "bg-success-500/10",
    text: "text-success-500",
    indicator: "bg-success-500",
  },
  warning: {
    bg: "bg-warning-500/10",
    text: "text-warning-500",
    indicator: "bg-warning-500",
  },
  danger: {
    bg: "bg-danger-500/10",
    text: "text-danger-500",
    indicator: "bg-danger-500",
  },
};

const radiusStyles: Record<TabsRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export const Tabs: React.FC<TabsProps> = ({
  variant = "solid",
  color = "primary",
  size = "md",
  radius = "md",
  fullWidth = false,
  tabs,
  selectedKey: controlledKey,
  defaultSelectedKey,
  onSelectionChange,
  children,
  className = "",
  ...props
}) => {
  const [internalKey, setInternalKey] = useState(
    defaultSelectedKey ?? tabs[0]?.key ?? ""
  );
  const selectedKey = controlledKey ?? internalKey;

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const registerTab = useCallback(
    (key: string, el: HTMLButtonElement | null) => {
      if (el) {
        tabRefs.current.set(key, el);
      } else {
        tabRefs.current.delete(key);
      }
    },
    []
  );

  const onSelect = useCallback(
    (key: string) => {
      if (!controlledKey) setInternalKey(key);
      onSelectionChange?.(key);
    },
    [controlledKey, onSelectionChange]
  );

  useEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current.get(selectedKey);
      const container = containerRef.current;
      const indicator = indicatorRef.current;
      if (!activeTab || !container || !indicator) return;

      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      indicator.style.width = `${tabRect.width}px`;
      indicator.style.left = `${tabRect.left - containerRect.left}px`;

      if (variant === "underlined") {
        indicator.style.height = "2px";
        indicator.style.top = "auto";
        indicator.style.bottom = "0px";
      } else {
        indicator.style.height = `${tabRect.height}px`;
        indicator.style.top = `${tabRect.top - containerRect.top}px`;
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [selectedKey, variant]);

  const containerVariantStyles = {
    solid: `bg-default-100 ${radiusStyles[radius]} p-1`,
    bordered: `border border-default-200 ${radiusStyles[radius]} p-1`,
    light: "",
    underlined: "border-b border-default-200",
  };

  const indicatorVariantStyles = {
    solid: `${colorValues[color].indicator} ${radiusStyles[radius]} shadow-sm`,
    bordered: `border-2 border-current ${colorValues[color].text} bg-white ${radiusStyles[radius]}`,
    light: `${colorValues[color].bg} ${radiusStyles[radius]}`,
    underlined: `${colorValues[color].indicator}`,
  };

  return (
    <div className={className} {...props}>
      <div
        ref={containerRef}
        className={`relative flex ${fullWidth ? "w-full" : "inline-flex"} ${containerVariantStyles[variant]}`}
        role="tablist"
      >
        <div
          ref={indicatorRef}
          className={`absolute transition-all duration-300 ease-out ${indicatorVariantStyles[variant]} pointer-events-none z-0`}
        />
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tabKey={tab.key}
            title={tab.title}
            icon={tab.icon}
            isDisabled={tab.isDisabled}
            selectedKey={selectedKey}
            variant={variant}
            color={color}
            size={size}
            fullWidth={fullWidth}
            onSelect={onSelect}
            registerTab={registerTab}
          />
        ))}
      </div>
      {children && (
        <div className="pt-4">{children(selectedKey)}</div>
      )}
    </div>
  );
};

interface TabButtonProps {
  tabKey: string;
  title: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
  selectedKey: string;
  variant: TabsVariant;
  color: TabsColor;
  size: TabsSize;
  fullWidth: boolean;
  onSelect: (key: string) => void;
  registerTab: (key: string, el: HTMLButtonElement | null) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  tabKey,
  title,
  icon,
  isDisabled = false,
  selectedKey,
  variant,
  color,
  size,
  fullWidth,
  onSelect,
  registerTab,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const isActive = selectedKey === tabKey;

  useEffect(() => {
    registerTab(tabKey, ref.current);
    return () => registerTab(tabKey, null);
  }, [tabKey, registerTab]);

  const activeTextColor =
    variant === "solid" ? "text-white" : colorValues[color].text;

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      disabled={isDisabled}
      onClick={() => onSelect(tabKey)}
      className={[
        "relative z-10 inline-flex items-center justify-center gap-2 font-medium",
        "outline-none transition-colors duration-200 cursor-pointer select-none",
        "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
        sizeStyles[size],
        fullWidth ? "flex-1" : "",
        isActive ? activeTextColor : "text-default-500 hover:text-default-700",
        isDisabled ? "opacity-50 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{title}</span>
    </button>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
