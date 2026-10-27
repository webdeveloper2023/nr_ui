import { CreditCard, Home, LifeBuoy, Settings, Users } from "lucide-react";
import { Avatar, Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarSurfaceVariant() {
  return (
    <div className="h-[460px]">
      <Sidebar
        variant="surface"
        defaultSelectedKey="billing"
        header={<span className="text-sm font-semibold text-foreground">Sozlamalar</span>}
        footer={
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name="Rafiqjon Nazirov" size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Rafiqjon</p>
              <p className="truncate text-xs text-muted">Admin</p>
            </div>
          </div>
        }
      >
        <SidebarSection>
          <SidebarItem itemKey="general" icon={<Home size={17} />} title="Umumiy" />
          <SidebarItem itemKey="members" icon={<Users size={17} />} title="A'zolar" />
          <SidebarItem itemKey="billing" icon={<CreditCard size={17} />} title="To'lovlar" />
          <SidebarItem itemKey="advanced" icon={<Settings size={17} />} title="Kengaytirilgan" />
        </SidebarSection>
        <SidebarSection title="Yordam">
          <SidebarItem itemKey="support" icon={<LifeBuoy size={17} />} title="Qo'llab-quvvatlash" />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
