import { FileText, LayoutDashboard, ShoppingBag, Users } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection } from "nr-ui-kit";

export default function SidebarNestedItems() {
  return (
    <div className="h-[420px] w-64">
      <Sidebar hideToggle defaultSelectedKey="orders-pending" header={<span className="text-sm font-semibold text-foreground">Store</span>}>
        <SidebarSection title="Manage">
          <SidebarItem itemKey="dashboard" icon={<LayoutDashboard size={17} />} title="Dashboard" />
          <SidebarItem itemKey="orders" icon={<ShoppingBag size={17} />} title="Orders">
            <SidebarItem itemKey="orders-all" title="All" />
            <SidebarItem itemKey="orders-pending" title="Pending" />
            <SidebarItem itemKey="orders-done" title="Completed" />
          </SidebarItem>
          <SidebarItem itemKey="customers" icon={<Users size={17} />} title="Customers">
            <SidebarItem itemKey="customers-list" title="List" />
            <SidebarItem itemKey="customers-segments" title="Segments" />
          </SidebarItem>
          <SidebarItem itemKey="reports" icon={<FileText size={17} />} title="Reports" />
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
