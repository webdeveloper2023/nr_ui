import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "nr-ui-kit";
import { Zap } from "lucide-react";

export default function NavbarBasic() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <Navbar position="static" isBordered maxWidth="full">
        <NavbarBrand>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
            <Zap size={14} />
          </span>
          Acme
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem isActive>Mahsulotlar</NavbarItem>
          <NavbarItem>Narxlar</NavbarItem>
          <NavbarItem>Blog</NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible>
          <NavbarItem>
            <Button size="sm" variant="ghost">
              Kirish
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button size="sm">Boshlash</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="h-24 bg-background" />
    </div>
  );
}
