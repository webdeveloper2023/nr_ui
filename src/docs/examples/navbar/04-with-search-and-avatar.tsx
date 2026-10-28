import { Avatar, Button, Input, Kbd, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "nr-ui-kit";
import { Bell, Search, Zap } from "lucide-react";

export default function NavbarWithSearchAvatar() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <Navbar position="static" isBordered maxWidth="full">
        <NavbarBrand>
          <Zap size={18} className="text-accent" />
          Dashboard
        </NavbarBrand>
        <NavbarContent justify="center" className="flex-1 max-w-sm">
          <Input
            size="sm"
            placeholder="Search..."
            startContent={<Search size={14} />}
            endContent={<Kbd keys="command">K</Kbd>}
          />
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible>
          <NavbarItem>
            <Button size="sm" variant="ghost" isIconOnly aria-label="Notifications">
              <Bell size={16} />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Avatar size="sm" src="https://i.pravatar.cc/150?u=rafiqjon" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="h-24 bg-background" />
    </div>
  );
}
