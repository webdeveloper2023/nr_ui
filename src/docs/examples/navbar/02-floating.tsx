import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "nr-ui-kit";
import { Zap } from "lucide-react";

export default function NavbarFloating() {
  return (
    <div className="rounded-3xl border border-border bg-background pb-16">
      <Navbar position="floating" maxWidth="lg">
        <NavbarBrand>
          <Zap size={18} className="text-accent" />
          Acme
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem variant="pill" isActive>
            Home
          </NavbarItem>
          <NavbarItem variant="pill">Pricing</NavbarItem>
          <NavbarItem variant="pill">Docs</NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible>
          <NavbarItem>
            <Button size="sm">Get Pro</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
