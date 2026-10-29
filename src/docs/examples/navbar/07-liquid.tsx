import { useState } from "react";
import { Search, Zap } from "lucide-react";
import { Avatar, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tabs } from "nr-ui-kit";

export default function NavbarLiquidGlass() {
  const [material, setMaterial] = useState<"frosted" | "liquid">("liquid");

  return (
    <div className="relative w-full overflow-hidden rounded-3xl pb-16">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <Navbar position="floating" maxWidth="lg" isBlurred material={material}>
        <NavbarBrand>
          <Zap size={18} className="text-accent" />
          <span className="font-semibold text-foreground">Acme</span>
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
      <div className="relative mt-10 flex justify-center">
        <Tabs
          tabs={[{ key: "frosted", title: "Frosted" }, { key: "liquid", title: "Liquid" }]}
          selectedKey={material}
          onSelectionChange={(k) => setMaterial(k as "frosted" | "liquid")}
          isBlurred
          material={material}
        />
      </div>
    </div>
  );
}
