import { useState } from "react";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "nr-ui-kit";
import { Zap } from "lucide-react";

const links = ["Products", "Pricing", "Blog"];

// Resize the window: with "t" the links fold into the menu below 1024px (tablets too), not only on phones.
export default function NavbarResponsive() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border [transform:translateZ(0)]">
      <Navbar responsive={["m", "t"]} position="static" isBordered maxWidth="full" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent justify="start" isAlwaysVisible className="flex-none">
          <NavbarMenuToggle />
          <NavbarBrand>
            <Zap size={18} className="text-accent" />
            Acme
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="center">
          {links.map((link, i) => (
            <NavbarItem key={link} isActive={i === 0}>
              {link}
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible className="flex-none">
          <NavbarItem>
            <Button size="sm" responsive>
              Get started
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {links.map((link, index) => (
            <NavbarMenuItem key={link} index={index} isActive={index === 0}>
              {link}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="h-40 bg-background" />
    </div>
  );
}
