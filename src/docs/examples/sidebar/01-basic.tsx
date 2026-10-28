import { useState } from "react";
import { BarChart3, FolderOpen, Home, Inbox, Settings, Users, Zap } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarBasic() {
  const [selected, setSelected] = useState("home");

  return (
    <div className="flex h-[460px] w-full overflow-hidden rounded-3xl border border-border bg-background">
      <Sidebar
        selectedKey={selected}
        onSelect={setSelected}
        header={
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Zap size={14} />
            </span>
            <span className="text-sm font-semibold text-foreground">Acme</span>
          </div>
        }
      >
        <SidebarSection>
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Home" />
          <SidebarItem itemKey="inbox" icon={<Inbox size={17} />} title="Inbox" endContent={<span className="text-xs text-muted">12</span>} />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={17} />} title="Analytics" />
        </SidebarSection>
        <SidebarSection title="Workspace">
          <SidebarItem itemKey="team" icon={<Users size={17} />} title="Team" />
          <SidebarItem itemKey="files" icon={<FolderOpen size={17} />} title="Files" />
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Settings" />
        </SidebarSection>
      </Sidebar>
      <main className="m-2 ml-0 flex-1 rounded-3xl bg-surface p-6 shadow-surface">
        <p className="text-sm text-muted">Current page</p>
        <p className="mt-1 text-xl font-semibold text-foreground">{selected}</p>
      </main>
    </div>
  );
}
