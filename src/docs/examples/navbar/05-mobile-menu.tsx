import { useState } from "react";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "nr-ui-kit";
import { Zap } from "lucide-react";

const links = ["Bosh sahifa", "Mahsulotlar", "Narxlar", "Blog", "Aloqa"];

// NavbarMenuToggle va NavbarMenu md'dan kichik ekranlarda ko'rinadi.
// Demo telefon ramkasida ko'rsatilgani uchun `md:!flex` bilan majburan ochilgan.
export default function NavbarMobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("Bosh sahifa");

  return (
    <div className="mx-auto h-[440px] w-[360px] overflow-hidden rounded-[2.25rem] border-[6px] border-default bg-background [transform:translateZ(0)]">
      <Navbar position="static" isBordered maxWidth="full" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent justify="start" isAlwaysVisible>
          <NavbarMenuToggle className="md:!flex" srOnlyText={isMenuOpen ? "Menyuni yopish" : "Menyuni ochish"} />
          <NavbarBrand>
            <Zap size={18} className="text-accent" />
            Acme
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end" isAlwaysVisible>
          <NavbarItem>
            <Button size="sm">Kirish</Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="md:!flex">
          {links.map((link, index) => (
            <NavbarMenuItem
              key={link}
              index={index}
              isActive={active === link}
              onClick={() => {
                setActive(link);
                setIsMenuOpen(false);
              }}
              className="cursor-pointer"
            >
              {link}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="p-6 text-sm text-muted">
        Tanlangan sahifa: <span className="font-medium text-foreground">{active}</span>
      </div>
    </div>
  );
}
