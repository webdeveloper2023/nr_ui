import { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "nr-ui-kit";

const links = ["Overview", "Analytics", "Reports"];
const variants = ["underline", "pill", "text"] as const;

export default function NavbarItemVariants() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="flex flex-col gap-4">
      {variants.map((variant) => (
        <div key={variant} className="overflow-hidden rounded-2xl border border-border">
          <Navbar position="static" maxWidth="full" height="3.5rem">
            <NavbarBrand className="text-sm text-muted">variant="{variant}"</NavbarBrand>
            <NavbarContent justify="end" isAlwaysVisible className="gap-1">
              {links.map((link) => (
                <NavbarItem key={link} variant={variant} isActive={active === link} onClick={() => setActive(link)}>
                  {link}
                </NavbarItem>
              ))}
            </NavbarContent>
          </Navbar>
        </div>
      ))}
    </div>
  );
}
