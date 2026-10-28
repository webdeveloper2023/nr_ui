// Shared data and widgets for the Solid / Frosted / Liquid dashboard templates.
import {
  useEffect, useState
} from "react";
import {
  Bell, Box, CheckCircle2, CreditCard, Download, Eye, HelpCircle, LogOut, Moon, MoreVertical, Rocket,
  Settings, ShoppingBag, Sparkles, Sun, User, Building2, AlertTriangle
} from "lucide-react";
import {
  Avatar, Badge, BillingToggle, Button, Checkbox, Chip, Divider, Dropdown, DropdownItem, DropdownMenu,
  DropdownSection, DropdownTrigger, FileUpload, Input, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader, Popover, PopoverContent, PopoverTrigger, PricingCard, Radio, RadioGroup, Select, Textarea,
  Timeline, Tooltip, useToast, type BillingPeriod
} from "nr-ui-kit";

import { avatarUrl } from "./data";

// ─── Small pieces ───────────────────────────
export function ThemeButton() {
  const [dark, setDark] = useState(() => {
    const param = new URLSearchParams(window.location.search).get("theme");
    if (param) return param === "dark";
    try {
      const saved = localStorage.getItem("nr-theme");
      if (saved === "dark" || saved === "light") return saved === "dark";
    } catch { /* ignore */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("nr-theme", dark ? "dark" : "light"); } catch { /* ignore */ }
  }, [dark]);
  return (
    <Tooltip content={dark ? "Light mode" : "Dark mode"} placement="bottom">
      <Button isIconOnly variant="ghost" aria-label="Theme" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </Tooltip>
  );
}

export function Notifications() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="ghost" aria-label="Bildirishnomalar">
          <Badge content="3" color="danger" size="sm">
            <Bell size={18} />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="font-medium text-foreground">Bildirishnomalar</p>
          <Chip size="sm" color="accent">3 ta yangi</Chip>
        </div>
        <div className="max-h-80 overflow-y-auto px-4 pb-4">
          <Timeline
            items={[
              { id: "n1", title: <><b className="font-medium">Ali</b> yangi buyurtma berdi</>, time: "2 daq", color: "accent", icon: <ShoppingBag size={14} /> },
              { id: "n2", title: "To'lov qabul qilindi", description: "#3207 · $599", time: "1 soat", color: "success", icon: <CheckCircle2 size={14} /> },
              { id: "n3", title: "Ombor zaxirasi kam", description: "Wireless earbuds — 4 dona qoldi", time: "3 soat", color: "warning", icon: <AlertTriangle size={14} /> },
            ]}
          />
        </div>
        <Divider />
        <div className="p-2">
          <Button variant="ghost" size="sm" fullWidth>Barchasini ko'rish</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserMenu() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label="Profil">
          <Avatar src={avatarUrl("rafiqjon")} name="Rafiqjon Nazirov" size="sm" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profil menyusi">
        <DropdownSection showDivider>
          <DropdownItem itemKey="me" description="admin@nr-ui.uz" startContent={<User size={16} />}>Rafiqjon Nazirov</DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem itemKey="settings" startContent={<Settings size={16} />} shortcut="⌘,">Sozlamalar</DropdownItem>
          <DropdownItem itemKey="billing" startContent={<CreditCard size={16} />}>To'lovlar</DropdownItem>
          <DropdownItem itemKey="help" startContent={<HelpCircle size={16} />}>Yordam</DropdownItem>
        </DropdownSection>
        <DropdownItem itemKey="logout" color="danger" startContent={<LogOut size={16} />}>Chiqish</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function CardMenu() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="ghost" aria-label="Amallar"><MoreVertical size={16} /></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Karta amallari">
        <DropdownItem itemKey="view" startContent={<Eye size={16} />}>Batafsil</DropdownItem>
        <DropdownItem itemKey="export" startContent={<Download size={16} />}>Eksport</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ─── New order modal ────────────────────────
export function NewOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = (close: () => void) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      close();
      addToast({ title: "Buyurtma yaratildi", description: "#3211 · mijozga xabar yuborildi", color: "success" });
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              Yangi buyurtma
              <p className="text-sm font-normal text-muted">Mijoz va mahsulot ma'lumotlarini kiriting</p>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Mijoz ismi" placeholder="Ism Familiya" variant="secondary" isRequired startContent={<User size={16} />} />
                <Input label="Email" type="email" placeholder="mijoz@mail.uz" variant="secondary" />
                <Select
                  label="Mahsulot"
                  variant="secondary"
                  items={[
                    { key: "mbp", label: "Laptop Pro 14", description: "$1,999", startContent: <Box size={16} /> },
                    { key: "iph", label: "Phone X Pro", description: "$1,199", startContent: <Box size={16} /> },
                    { key: "tablet", label: "Tablet Air 11", description: "$599", startContent: <Box size={16} /> },
                  ]}
                />
                <Input label="Miqdor" type="number" defaultValue="1" variant="secondary" />
              </div>
              <RadioGroup label="Yetkazib berish" orientation="horizontal" defaultValue="courier" variant="secondary">
                <Radio value="courier" description="1–2 kun">Kuryer</Radio>
                <Radio value="pickup" description="Bugun">Olib ketish</Radio>
                <Radio value="post" description="3–5 kun">Pochta</Radio>
              </RadioGroup>
              <Textarea label="Izoh" placeholder="Qo'shimcha ma'lumot..." variant="secondary" maxLength={200} showCount />
              <FileUpload variant="secondary" maxSizeMB={5} label="Yuklash uchun bosing yoki faylni shu yerga tashlang" description="Hisob-faktura yoki rasm — 5 MB gacha" />
              <Checkbox variant="secondary" defaultSelected>Mijozga SMS xabar yuborish</Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button variant="tertiary" onClick={close}>Bekor qilish</Button>
              <Button isLoading={saving} onClick={() => save(close)}>Saqlash</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ─── Upgrade modal (pricing) ────────────────
export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const { addToast } = useToast();
  const choose = (plan: string) => {
    onClose();
    addToast({ title: `${plan} tarifi tanlandi`, description: "To'lov sahifasiga yo'naltirilmoqda…", color: "accent" });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Tarifni tanlang</ModalHeader>
        <ModalBody>
          <div className="mb-8 flex justify-center">
            <BillingToggle value={period} onChange={setPeriod} labels={{ monthly: "Oylik", yearly: "Yillik" }} />
          </div>
          <div className="grid items-start gap-4 md:grid-cols-3">
            <PricingCard name="Starter" description="Kichik do'konlar uchun" icon={<Sparkles size={18} />} price={{ monthly: 0, yearly: 0 }} period={period}
              features={["100 ta buyurtma/oy", "1 foydalanuvchi", { label: "Analitika", included: false }]} ctaLabel="Joriy tarif" onSelect={() => choose("Starter")} />
            <PricingCard name="Pro" description="O'sayotgan bizneslar" icon={<Rocket size={18} />} price={{ monthly: 29, yearly: 279 }} period={period} isPopular popularLabel="Mashhur" ctaLabel="Boshlash"
              features={["Cheksiz buyurtma", "10 foydalanuvchi", "Analitika", "AI yordamchi"]} onSelect={() => choose("Pro")} />
            <PricingCard name="Enterprise" description="Katta kompaniyalar" icon={<Building2 size={18} />} price="Custom" period={period} variant="inverse"
              features={["SSO & SAML", "SLA 99.99%", "Shaxsiy menejer"]} ctaLabel="Bog'lanish" onSelect={() => choose("Enterprise")} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

