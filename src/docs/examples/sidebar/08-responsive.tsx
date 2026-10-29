import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";
import { BarChart3, Home, Inbox, Settings, Users } from "lucide-react";

// Resize the window: full width with touch-sized items on mobile, an icon rail on tablet, 288px on desktop.
export default function SidebarResponsive() {
  return (
    <div className="h-[420px] rounded-3xl bg-background p-3">
      <Sidebar responsive variant="surface" defaultSelectedKey="home" header={<span className="font-semibold">Acme</span>}>
        <SidebarSection title="Main">
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Home" />
          <SidebarItem itemKey="inbox" icon={<Inbox size={17} />} title="Inbox" />
          <SidebarItem itemKey="reports" icon={<BarChart3 size={17} />} title="Reports" />
          <SidebarItem itemKey="team" icon={<Users size={17} />} title="Team" />
        </SidebarSection>
        <SidebarSection title="Account">
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Settings" />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
