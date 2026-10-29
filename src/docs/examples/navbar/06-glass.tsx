import { Search, Zap } from "lucide-react";
import { Avatar, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "nr-ui-kit";

export default function NavbarGlass() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-3xl">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Navbar position="floating" maxWidth="lg" isBlurred>
        <NavbarBrand>
          <Zap size={18} className="text-accent" />
          Acme
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem variant="pill" isActive>Home</NavbarItem>
          <NavbarItem variant="pill">Products</NavbarItem>
          <NavbarItem variant="pill">Pricing</NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible>
          <NavbarItem>
            <Button variant="ghost" isIconOnly size="sm" aria-label="Search"><Search size={16} /></Button>
          </NavbarItem>
          <NavbarItem>
            <Avatar size="sm" name="Rafiqjon Nazirov" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <p className="relative mt-16 text-center text-sm text-foreground/70">Content under the navbar shows blurred through the glass</p>
    </div>
  );
}
