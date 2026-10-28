import { useState } from "react";
import { BarChart3, Home, Inbox, Settings, Zap } from "lucide-react";
import { Sidebar, SidebarItem, SidebarSection, Tabs } from "nr-ui-kit";

export default function SidebarLiquidGlass() {
  const [material, setMaterial] = useState<"frosted" | "liquid">("liquid");
  const [selected, setSelected] = useState("home");

  return (
    <div className="relative flex h-[420px] w-full gap-6 overflow-hidden rounded-3xl p-4">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <Sidebar
        className="relative"
        isBlurred
        material={material}
        selectedKey={selected}
        onSelect={setSelected}
        header={
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-white"><Zap size={14} /></span>
            <span className="font-semibold text-foreground">Acme</span>
          </div>
        }
      >
        <SidebarSection>
          <SidebarItem itemKey="home" icon={<Home size={17} />} title="Home" />
          <SidebarItem itemKey="inbox" icon={<Inbox size={17} />} title="Inbox" />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={17} />} title="Analytics" />
          <SidebarItem itemKey="settings" icon={<Settings size={17} />} title="Settings" />
        </SidebarSection>
      </Sidebar>
      <div className="relative flex flex-1 items-start justify-center pt-6">
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
