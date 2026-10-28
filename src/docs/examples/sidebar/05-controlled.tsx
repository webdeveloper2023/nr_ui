import { useState } from "react";
import { BarChart3, Home, PanelLeft, Settings } from "lucide-react";
import { Button, Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarControlled() {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("home");

  return (
    <div className="flex h-[360px] w-full overflow-hidden rounded-3xl border border-border">
      <Sidebar hideToggle isCollapsed={collapsed} selectedKey={selected} onSelect={setSelected}>
        <SidebarSection>
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Home" />
          <SidebarItem itemKey="stats" icon={<BarChart3 size={17} />} title="Statistics" />
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Settings" />
        </SidebarSection>
      </Sidebar>
      <main className="flex-1 border-l border-separator p-5">
        <Button variant="tertiary" size="sm" startContent={<PanelLeft size={15} />} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "Expand" : "Collapse"}
        </Button>
        <p className="mt-4 text-sm text-muted">
          Page: <span className="font-medium text-foreground">{selected}</span>
        </p>
      </main>
    </div>
  );
}
