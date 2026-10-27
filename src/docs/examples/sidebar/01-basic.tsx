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
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Bosh sahifa" />
          <SidebarItem itemKey="inbox" icon={<Inbox size={17} />} title="Xabarlar" endContent={<span className="text-xs text-muted">12</span>} />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={17} />} title="Analitika" />
        </SidebarSection>
        <SidebarSection title="Ish joyi">
          <SidebarItem itemKey="team" icon={<Users size={17} />} title="Jamoa" />
          <SidebarItem itemKey="files" icon={<FolderOpen size={17} />} title="Fayllar" />
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Sozlamalar" />
        </SidebarSection>
      </Sidebar>
      <main className="m-2 ml-0 flex-1 rounded-3xl bg-surface p-6 shadow-surface">
        <p className="text-sm text-muted">Tanlangan sahifa</p>
        <p className="mt-1 text-xl font-semibold text-foreground">{selected}</p>
      </main>
    </div>
  );
}
