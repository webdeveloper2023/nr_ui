import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  children?: SidebarItem[];
  badge?: ReactNode;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

function SidebarItemComponent({
  item,
  activeKey,
  onSelect,
  collapsed,
  depth = 0,
}: {
  item: SidebarItem;
  activeKey?: string;
  onSelect?: (key: string) => void;
  collapsed: boolean;
  depth?: number;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeKey === item.key;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen(!open);
          else onSelect?.(item.key);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer group
          ${isActive ? "bg-primary-100 text-primary-700 font-medium" : "text-default-600 hover:bg-default-100 hover:text-default-900"}
          ${depth > 0 ? "ml-4" : ""}
        `}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>}
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge && <span>{item.badge}</span>}
            {hasChildren && (
              <span className="text-default-400">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </>
        )}
      </button>
      {hasChildren && open && !collapsed && (
        <div className="mt-0.5">
          {item.children!.map((child) => (
            <SidebarItemComponent key={child.key} item={child} activeKey={activeKey} onSelect={onSelect} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  sections,
  activeKey,
  onSelect,
  header,
  footer,
  collapsed = false,
  onCollapse,
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-col bg-white border-r border-default-200 transition-all duration-300 h-full
        ${collapsed ? "w-[68px]" : "w-[260px]"} ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-default-100">
        {!collapsed && header && <div className="flex-1 min-w-0">{header}</div>}
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="p-1.5 rounded-lg text-default-400 hover:text-default-700 hover:bg-default-100 transition-colors cursor-pointer"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && !collapsed && (
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-default-400">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItemComponent key={item.key} item={item} activeKey={activeKey} onSelect={onSelect} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="px-3 py-3 border-t border-default-100">
          {footer}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
