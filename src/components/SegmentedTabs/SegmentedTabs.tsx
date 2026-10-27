import { useState, useRef, useEffect, type ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

type TabSize = "sm" | "md" | "lg";
type TabRadius = "none" | "sm" | "md" | "lg" | "full";
type TabColor = "default" | "primary";

interface SegmentedTabsProps {
  tabs: Tab[];
  activeKey?: string;
  defaultKey?: string;
  onChange?: (key: string) => void;
  size?: TabSize;
  radius?: TabRadius;
  color?: TabColor;
  fullWidth?: boolean;
  className?: string;
}

const sizeMap: Record<TabSize, string> = {
  sm: "h-8 text-xs px-3",
  md: "h-9 text-sm px-4",
  lg: "h-11 text-base px-5",
};

const containerSizeMap: Record<TabSize, string> = {
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1",
};

const radiusMap: Record<TabRadius, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export function SegmentedTabs({
  tabs,
  activeKey,
  defaultKey,
  onChange,
  size = "md",
  radius = "lg",
  color = "default",
  fullWidth = false,
  className = "",
}: SegmentedTabsProps) {
  const [internalKey, setInternalKey] = useState(defaultKey ?? tabs[0]?.key ?? "");
  const current = activeKey ?? internalKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeIndex = tabs.findIndex((t) => t.key === current);
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-tab-btn]");
    const btn = buttons[activeIndex];
    if (btn) {
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [current, tabs]);

  const handleChange = (key: string) => {
    setInternalKey(key);
    onChange?.(key);
  };

  const indicatorColor = color === "primary" ? "bg-primary-500 shadow-md shadow-primary-200" : "bg-white shadow-sm";
  const activeTextColor = color === "primary" ? "text-white" : "text-default-900";

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex bg-default-100 ${containerSizeMap[size]} ${radiusMap[radius]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <div
        className={`absolute top-1 ${indicatorColor} ${radiusMap[radius]} transition-all duration-200 ease-out`}
        style={{ left: indicator.left, width: indicator.width, height: "calc(100% - 8px)" }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.key}
          data-tab-btn
          onClick={() => handleChange(tab.key)}
          className={`relative z-10 inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-200 cursor-pointer ${sizeMap[size]} ${radiusMap[radius]} ${fullWidth ? "flex-1" : ""} ${
            current === tab.key ? activeTextColor : "text-default-500 hover:text-default-700"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedTabs;
