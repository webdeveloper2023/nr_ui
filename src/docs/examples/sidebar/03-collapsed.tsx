import { Bell, Calendar, Home, MessageSquare, Settings } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarCollapsed() {
  return (
    <div className="flex h-[400px] justify-center">
      <Sidebar defaultCollapsed defaultSelectedKey="home">
        <SidebarSection>
          <SidebarItem itemKey="home" icon={<Home size={18} />} title="Bosh sahifa" />
          <SidebarItem itemKey="messages" icon={<MessageSquare size={18} />} title="Xabarlar" />
          <SidebarItem itemKey="calendar" icon={<Calendar size={18} />} title="Kalendar" />
          <SidebarItem itemKey="notifications" icon={<Bell size={18} />} title="Bildirishnomalar" />
        </SidebarSection>
        <SidebarSection title="Boshqa">
          <SidebarItem itemKey="settings" icon={<Settings size={18} />} title="Sozlamalar" />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
