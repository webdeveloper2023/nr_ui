import { FileText, LayoutDashboard, ShoppingBag, Users } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarNestedItems() {
  return (
    <div className="h-[420px] w-64">
      <Sidebar hideToggle defaultSelectedKey="orders-pending" header={<span className="text-sm font-semibold text-foreground">Do'kon</span>}>
        <SidebarSection title="Boshqaruv">
          <SidebarItem itemKey="dashboard" icon={<LayoutDashboard size={17} />} title="Dashboard" />
          <SidebarItem itemKey="orders" icon={<ShoppingBag size={17} />} title="Buyurtmalar">
            <SidebarItem itemKey="orders-all" title="Barchasi" />
            <SidebarItem itemKey="orders-pending" title="Kutilmoqda" />
            <SidebarItem itemKey="orders-done" title="Bajarilgan" />
          </SidebarItem>
          <SidebarItem itemKey="customers" icon={<Users size={17} />} title="Mijozlar">
            <SidebarItem itemKey="customers-list" title="Ro'yxat" />
            <SidebarItem itemKey="customers-segments" title="Segmentlar" />
          </SidebarItem>
          <SidebarItem itemKey="reports" icon={<FileText size={17} />} title="Hisobotlar" />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
