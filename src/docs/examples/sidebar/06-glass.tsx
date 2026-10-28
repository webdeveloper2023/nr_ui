import { useState } from "react";
import { BarChart3, Home, Inbox, Settings, Zap } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarGlass() {
  const [selected, setSelected] = useState("home");

  return (
    <div className="relative flex h-[420px] w-full gap-3 overflow-hidden rounded-3xl p-3">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Sidebar
        isBlurred
        className="relative"
        selectedKey={selected}
        onSelect={setSelected}
        header={
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Zap size={14} />
            </span>
            <span className="text-sm font-semibold text-foreground">Acme</span>
          </div>
        }
      >
        <SidebarSection>
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Home" />
          <SidebarItem itemKey="inbox" icon={<Inbox size={17} />} title="Inbox" />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={17} />} title="Analytics" />
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Settings" />
        </SidebarSection>
      </Sidebar>
      <main className="glass-thin relative flex-1 rounded-3xl p-6">
        <p className="text-sm text-muted">Current page</p>
        <p className="mt-1 text-xl font-semibold text-foreground">{selected}</p>
      </main>
    </div>
  );
}
