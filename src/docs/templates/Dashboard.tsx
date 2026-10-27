import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BarChart3, Bell, BookOpen, Box, CheckCircle2, CreditCard, DollarSign, Download,
  Eye, FolderOpen, HelpCircle, LayoutDashboard, LogOut, MessageSquare, Moon, MoreVertical, Package, Pencil,
  Plus, RefreshCw, Rocket, Search, Settings, ShoppingBag, Sparkles, Sun, Trash2, TrendingUp, Truck, User,
  Users, Zap, Building2, AlertTriangle,
} from "lucide-react";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, BillingToggle, Button, ButtonGroup, Card,
  CardBody, CardFooter, CardHeader, ChatContainer, ChatMessage, Checkbox, CheckboxGroup, Chip, CircularProgress,
  Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, FileUpload, Input, Kbd,
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Pagination, Popover, PopoverContent, PopoverTrigger, PricingCard, Progress, PromptInput, Radio, RadioGroup,
  Rating, Select, Sidebar, SidebarItem, SidebarSection, Skeleton, Sparkline, Spinner, StatCard, Stepper,
  Switch, Table, Tabs, Textarea, Timeline, Tooltip, useToast, type BillingPeriod,
} from "nr-ui-kit";

// ─── Data ───────────────────────────────────
type Status = "paid" | "pending" | "shipped" | "cancelled";
type Order = { id: string; customer: string; email: string; product: string; amount: number; status: Status; date: string };

const STATUS: Record<Status, { label: string; color: "success" | "warning" | "accent" | "danger" }> = {
  paid: { label: "To'langan", color: "success" },
  pending: { label: "Kutilmoqda", color: "warning" },
  shipped: { label: "Yo'lda", color: "accent" },
  cancelled: { label: "Bekor qilingan", color: "danger" },
};

const ORDERS: Order[] = [
  { id: "#3210", customer: "Ali Valiyev", email: "ali@acme.uz", product: "Laptop Pro 14", amount: 1999, status: "paid", date: "27 okt" },
  { id: "#3209", customer: "Dilnoza Karimova", email: "dilnoza@acme.uz", product: "Phone X Pro", amount: 1199, status: "shipped", date: "27 okt" },
  { id: "#3208", customer: "Jasur Rahimov", email: "jasur@acme.uz", product: "Wireless earbuds", amount: 249, status: "pending", date: "26 okt" },
  { id: "#3207", customer: "Madina Usmonova", email: "madina@acme.uz", product: "Tablet Air 11", amount: 599, status: "paid", date: "26 okt" },
  { id: "#3206", customer: "Bekzod Tursunov", email: "bekzod@acme.uz", product: "Smartwatch S", amount: 399, status: "cancelled", date: "25 okt" },
  { id: "#3205", customer: "Nigora Aliyeva", email: "nigora@acme.uz", product: "Wireless keyboard", amount: 299, status: "paid", date: "25 okt" },
  { id: "#3204", customer: "Sardor Qodirov", email: "sardor@acme.uz", product: "5K display", amount: 1599, status: "shipped", date: "24 okt" },
  { id: "#3203", customer: "Kamola Ergasheva", email: "kamola@acme.uz", product: "Mini PC", amount: 599, status: "pending", date: "24 okt" },
];

const REVENUE: Record<string, { data: number[]; total: string; change: string }> = {
  week: { data: [32, 41, 38, 52, 47, 61, 58], total: "$12,480", change: "+8.2%" },
  month: { data: [22, 28, 25, 31, 36, 33, 40, 44, 41, 48, 52, 49, 57, 61, 58, 66], total: "$48,230", change: "+12.5%" },
  year: { data: [120, 135, 128, 150, 162, 158, 175, 190, 184, 205, 221, 240], total: "$512,900", change: "+31.4%" },
};

const TEAM = [
  { name: "Ali Valiyev", role: "CEO", online: true },
  { name: "Dilnoza Karimova", role: "Tech Lead", online: true },
  { name: "Jasur Rahimov", role: "Dizayner", online: false },
  { name: "Madina Usmonova", role: "QA", online: true },
];

const PAGE_SIZE = 5;
const avatarUrl = (seed: string) => `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;

// ─── Small pieces ───────────────────────────
function ThemeButton() {
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

function Notifications() {
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

function UserMenu() {
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

function CardMenu() {
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
function NewOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

// ─── Page ───────────────────────────────────
export default function Dashboard() {
  const { addToast } = useToast();
  const [nav, setNav] = useState("dashboard");
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [orderOpen, setOrderOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [step, setStep] = useState(2);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "user", text: "Bu hafta eng ko'p sotilgan mahsulot qaysi?" },
    { role: "assistant", text: "Laptop Pro 14 — 42 ta sotuv, umumiy daromadning 38%. O'tgan haftaga nisbatan +12%." },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({ title: "Ma'lumotlar yangilandi", color: "success", timeout: 2500 });
    }, 900);
  };

  const filtered = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          (status === "all" || o.status === status) &&
          (o.customer.toLowerCase().includes(query.toLowerCase()) || o.id.includes(query) || o.product.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, status]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sendChat = (text: string) => {
    setMessages((m) => [...m, { role: "user", text }]);
    setChatLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: "Tahlil qildim: kutilayotgan 2 ta buyurtmani bugun jo'natsangiz, haftalik maqsadga 96% yetasiz." }]);
      setChatLoading(false);
    }, 1400);
  };

  const revenue = REVENUE[range];

  return (
    <div className="flex h-screen bg-background">
      {/* ━━━ Sidebar ━━━ */}
      <Sidebar
        className="hidden lg:flex"
        selectedKey={nav}
        onSelect={setNav}
        header={
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background"><Zap size={16} /></span>
            <span className="font-semibold text-foreground">Acme Store</span>
          </div>
        }
        footer={
          <Card variant="default" className="p-3">
            <p className="text-sm font-medium text-foreground">Pro'ga o'ting</p>
            <p className="mt-0.5 text-xs text-muted">AI yordamchi va cheksiz buyurtmalar</p>
            <Progress value={72} size="sm" className="mt-3" label="Limit" showValueLabel />
            <Button size="sm" fullWidth className="mt-3" onClick={() => setUpgradeOpen(true)}>Yangilash</Button>
          </Card>
        }
      >
        <SidebarSection title="Asosiy">
          <SidebarItem itemKey="dashboard" icon={<LayoutDashboard size={18} />} title="Dashboard" />
          <SidebarItem itemKey="orders" icon={<ShoppingBag size={18} />} title="Buyurtmalar" endContent={<Chip size="sm" color="accent">8</Chip>}>
            <SidebarItem itemKey="orders-all" title="Barchasi" />
            <SidebarItem itemKey="orders-pending" title="Kutilmoqda" />
            <SidebarItem itemKey="orders-shipped" title="Yo'lda" />
          </SidebarItem>
          <SidebarItem itemKey="products" icon={<Package size={18} />} title="Mahsulotlar" />
          <SidebarItem itemKey="customers" icon={<Users size={18} />} title="Mijozlar" />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={18} />} title="Analitika" />
        </SidebarSection>
        <SidebarSection title="Ish joyi">
          <SidebarItem itemKey="messages" icon={<MessageSquare size={18} />} title="Xabarlar" endContent={<Chip size="sm" color="danger" variant="primary">3</Chip>} />
          <SidebarItem itemKey="files" icon={<FolderOpen size={18} />} title="Fayllar" />
          <SidebarItem itemKey="docs" icon={<BookOpen size={18} />} title="Hujjatlar" href="/" />
          <SidebarItem itemKey="settings" icon={<Settings size={18} />} title="Sozlamalar" />
        </SidebarSection>
      </Sidebar>

      {/* ━━━ Main ━━━ */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <Navbar position="sticky" isBlurred isBordered maxWidth="full">
          <NavbarBrand>
            <div>
              <p className="text-base font-semibold text-foreground">Dashboard</p>
              <p className="hidden sm:block text-xs text-muted">Seshanba, 27 oktyabr</p>
            </div>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem className="hidden md:flex">
              <Input
                size="sm"
                radius="full"
                placeholder="Qidirish..."
                startContent={<Search size={15} />}
                endContent={<Kbd keys="ctrl">K</Kbd>}
                className="w-64"
                aria-label="Qidirish"
              />
            </NavbarItem>
            <NavbarItem><Notifications /></NavbarItem>
            <NavbarItem><ThemeButton /></NavbarItem>
            <NavbarItem><UserMenu /></NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Xush kelibsiz, Rafiqjon 👋</h1>
              <p className="mt-1 text-sm text-muted">Do'koningizning bugungi holati</p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Yangilash">
                <Button isIconOnly variant="tertiary" onClick={refresh} aria-label="Yangilash">
                  {loading ? <Spinner size="sm" color="current" /> : <RefreshCw size={16} />}
                </Button>
              </Tooltip>
              <Button variant="tertiary" startContent={<Download size={16} />}>Eksport</Button>
              <Button startContent={<Plus size={16} />} onClick={() => setOrderOpen(true)}>Yangi buyurtma</Button>
            </div>
          </div>

          {showAlert && (
            <Alert
              color="accent"
              variant="soft"
              title="Pro tarifning 14 kunlik bepul sinovi"
              description="AI yordamchi, kengaytirilgan analitika va cheksiz buyurtmalarni sinab ko'ring."
              action={<Button size="sm" onClick={() => setUpgradeOpen(true)}>Sinab ko'rish</Button>}
              onClose={() => setShowAlert(false)}
            />
          )}

          {/* KPI */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Daromad", value: "$48,230", change: 12.5, color: "accent" as const, icon: <DollarSign size={16} />, chart: [22, 28, 25, 31, 36, 33, 40, 44] },
              { title: "Buyurtmalar", value: "1,284", change: 8.2, color: "success" as const, icon: <ShoppingBag size={16} />, chart: [12, 15, 14, 18, 17, 21, 24, 23] },
              { title: "Yangi mijozlar", value: "342", change: -3.1, color: "warning" as const, icon: <Users size={16} />, chart: [30, 28, 31, 27, 26, 25, 27, 24] },
              { title: "Konversiya", value: "3.8%", change: 1.7, color: "danger" as const, icon: <TrendingUp size={16} />, progress: 64 },
            ].map((k) => (
              <Skeleton key={k.title} isLoaded={!loading} className="rounded-3xl">
                <StatCard title={k.title} value={k.value} change={k.change} color={k.color} icon={k.icon} chartData={k.chart} progress={k.progress} actions={<CardMenu />} />
              </Skeleton>
            ))}
          </div>

          {/* Revenue + goals */}
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title="Daromad dinamikasi"
                description={<span className="flex items-center gap-2">{revenue.total} <Chip size="sm" color="success" startContent={<ArrowUpRight size={12} />}>{revenue.change}</Chip></span>}
                endContent={
                  <Tabs
                    size="sm"
                    selectedKey={range}
                    onSelectionChange={setRange}
                    tabs={[
                      { key: "week", title: "7 kun" },
                      { key: "month", title: "30 kun" },
                      { key: "year", title: "12 oy" },
                    ]}
                  />
                }
              />
              <CardBody>
                <Skeleton isLoaded={!loading} className="h-48 rounded-2xl">
                  <Sparkline data={revenue.data} height={192} color="accent" showArea />
                </Skeleton>
              </CardBody>
              <CardFooter showDivider className="flex-wrap gap-6">
                {[
                  { label: "Onlayn", value: "$31,420", color: "bg-accent" },
                  { label: "Do'kon", value: "$12,610", color: "bg-success" },
                  { label: "Ulgurji", value: "$4,200", color: "bg-warning" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-sm">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="text-muted">{s.label}</span>
                    <span className="font-medium text-foreground">{s.value}</span>
                  </div>
                ))}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader title="Oylik maqsadlar" description="Oktyabr, 2026" endContent={<CardMenu />} />
              <CardBody className="space-y-5">
                <div className="flex items-center gap-4 rounded-2xl bg-surface-secondary p-4">
                  <CircularProgress value={78} size="lg" color="accent" showValueLabel />
                  <div>
                    <p className="text-sm font-medium text-foreground">Sotuv rejasi</p>
                    <p className="text-xs text-muted">$48.2k / $62k</p>
                  </div>
                </div>
                <Progress label="Yangi mijozlar" value={342} maxValue={500} showValueLabel color="success" />
                <Progress label="Qaytarishlar" value={18} maxValue={100} showValueLabel color="danger" />
                <Progress label="Ombor to'ldirish" value={55} showValueLabel color="warning" />
              </CardBody>
            </Card>
          </div>

          {/* Orders table */}
          <Card>
            <CardHeader
              title="So'nggi buyurtmalar"
              description={`${filtered.length} ta buyurtma${selected.size ? ` · ${selected.size} ta tanlangan` : ""}`}
              endContent={
                <ButtonGroup size="sm" variant="tertiary">
                  <Button startContent={<Download size={14} />}>CSV</Button>
                  <Button isDisabled={!selected.size} startContent={<Trash2 size={14} />} onClick={() => { addToast({ title: `${selected.size} ta buyurtma o'chirildi`, color: "danger" }); setSelected(new Set()); }}>O'chirish</Button>
                </ButtonGroup>
              }
            />
            <CardBody>
              <Table<Order>
                aria-label="Buyurtmalar"
                variant="secondary"
                keyField="id"
                rows={rows}
                selectionMode="multiple"
                selectedKeys={selected}
                onSelectionChange={setSelected}
                isLoading={loading}
                topContent={
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      size="sm"
                      variant="secondary"
                      placeholder="Mijoz, ID yoki mahsulot..."
                      startContent={<Search size={14} />}
                      value={query}
                      onValueChange={(v) => { setQuery(v); setPage(1); }}
                      isClearable
                      onClear={() => setQuery("")}
                      className="w-full max-w-xs"
                      aria-label="Qidirish"
                    />
                    <div className="w-48">
                      <Select
                        size="sm"
                        variant="secondary"
                        aria-label="Holat"
                        selectedKey={status}
                        onSelectionChange={(k) => { setStatus(k); setPage(1); }}
                        items={[
                          { key: "all", label: "Barcha holatlar" },
                          ...Object.entries(STATUS).map(([key, s]) => ({ key, label: s.label })),
                        ]}
                      />
                    </div>
                  </div>
                }
                emptyContent={<div className="py-10 text-center text-sm text-muted">Hech narsa topilmadi</div>}
                bottomContent={
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">Sahifa {page} / {pages}</p>
                    <Pagination total={pages} page={page} onChange={setPage} size="sm" />
                  </div>
                }
                columns={[
                  { key: "id", label: "ID", render: (v) => <span className="font-mono text-xs text-muted">{String(v)}</span> },
                  {
                    key: "customer",
                    label: "Mijoz",
                    sortable: true,
                    render: (_v, r) => (
                      <div className="flex items-center gap-3">
                        <Avatar src={avatarUrl(r.email)} name={r.customer} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{r.customer}</p>
                          <p className="truncate text-xs text-muted">{r.email}</p>
                        </div>
                      </div>
                    ),
                  },
                  { key: "product", label: "Mahsulot" },
                  { key: "amount", label: "Summa", sortable: true, align: "end", render: (v) => <span className="tabular-nums">${Number(v).toLocaleString("en-US")}</span> },
                  { key: "status", label: "Holat", render: (v) => <Chip size="sm" dot color={STATUS[v as Status].color}>{STATUS[v as Status].label}</Chip> },
                  { key: "date", label: "Sana", render: (v) => <span className="text-muted">{String(v)}</span> },
                  {
                    key: "actions",
                    label: "",
                    align: "end",
                    render: (_v, r) => (
                      <div className="flex justify-end gap-0.5">
                        <Tooltip content="Ko'rish"><Button isIconOnly size="sm" variant="ghost" aria-label="Ko'rish"><Eye size={15} /></Button></Tooltip>
                        <Tooltip content="Tahrirlash"><Button isIconOnly size="sm" variant="ghost" aria-label="Tahrirlash"><Pencil size={15} /></Button></Tooltip>
                        <Tooltip content="Jo'natish"><Button isIconOnly size="sm" variant="ghost" aria-label="Jo'natish" onClick={() => addToast({ title: `${r.id} jo'natildi`, icon: <Truck size={16} />, color: "accent" })}><Truck size={15} /></Button></Tooltip>
                      </div>
                    ),
                  },
                ]}
              />
            </CardBody>
          </Card>

          {/* Activity · Team · AI */}
          <div className="grid gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader title="Faollik" description="So'nggi 24 soat" endContent={<Activity size={16} className="text-muted" />} />
              <CardBody>
                <Timeline
                  items={[
                    { id: "a1", title: <><b className="font-medium">Dilnoza</b> #3209 ni jo'natdi</>, time: "10 daq", color: "accent", icon: <Truck size={14} /> },
                    { id: "a2", title: "To'lov qabul qilindi", description: "Click · $599", time: "1 soat", color: "success", icon: <DollarSign size={14} /> },
                    { id: "a3", title: <><b className="font-medium">Jasur</b> mahsulot qo'shdi</>, time: "3 soat", icon: <Package size={14} />, content: <div className="rounded-xl bg-surface-secondary px-3 py-2 text-xs text-muted">5K display · 12 dona · $1,599</div> },
                    { id: "a4", title: "Zaxira kam qoldi", description: "Wireless earbuds — 4 dona", time: "5 soat", color: "warning", icon: <AlertTriangle size={14} /> },
                  ]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Jamoa"
                description="4 a'zo · 3 onlayn"
                endContent={
                  <AvatarGroup max={3} size="sm">
                    {TEAM.map((m) => <Avatar key={m.name} src={avatarUrl(m.name)} name={m.name} />)}
                  </AvatarGroup>
                }
              />
              <CardBody className="space-y-1">
                {TEAM.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-surface-secondary transition-colors">
                    <Badge isDot color={m.online ? "success" : "default"} placement="bottom-right">
                      <Avatar src={avatarUrl(m.name)} name={m.name} size="sm" />
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted">{m.role}</p>
                    </div>
                    <Button isIconOnly size="sm" variant="ghost" aria-label="Xabar"><MessageSquare size={15} /></Button>
                  </div>
                ))}
                <Divider className="my-3" />
                <div className="flex items-center justify-between px-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Mijozlar bahosi</p>
                    <p className="text-xs text-muted">1,240 ta sharh</p>
                  </div>
                  <Rating value={4.6} isReadOnly size="sm" showValue />
                </div>
              </CardBody>
            </Card>

            <Card className="flex flex-col">
              <CardHeader
                title={<span className="flex items-center gap-2"><Sparkles size={16} className="text-accent" /> AI yordamchi</span>}
                description="Savdo bo'yicha savol bering"
                endContent={<Chip size="sm" color="success" dot>Onlayn</Chip>}
              />
              <ChatContainer className="h-64 flex-1 space-y-4 overflow-y-auto px-4">
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} showActions={m.role === "assistant"}>{m.text}</ChatMessage>
                ))}
                {chatLoading && <ChatMessage role="assistant" isTyping />}
              </ChatContainer>
              <div className="p-3">
                <PromptInput onSubmit={sendChat} isLoading={chatLoading} onStop={() => setChatLoading(false)} minRows={1} suggestions={["Haftalik hisobot", "Eng yaxshi mijozlar"]} />
              </div>
            </Card>
          </div>

          {/* Onboarding · Settings */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader title="Do'konni sozlash" description={`${step} / 4 bosqich bajarildi`} />
              <CardBody className="space-y-6">
                <Stepper
                  currentStep={step}
                  onStepChange={setStep}
                  steps={[
                    { title: "Profil", description: "Asosiy ma'lumot" },
                    { title: "Mahsulotlar", description: "Katalog" },
                    { title: "To'lov", description: "Click, Payme" },
                    { title: "Ishga tushirish" },
                  ]}
                />
                <Accordion variant="splitted" defaultExpandedKeys={new Set(["pay"])}>
                  <AccordionItem itemKey="pay" title="To'lov tizimini ulash" subtitle="Keyingi qadam" startContent={<CreditCard size={18} className="text-accent" />}>
                    <p className="text-sm text-muted">Click yoki Payme kalitlarini kiriting — mijozlar karta orqali to'lay oladi.</p>
                    <Button size="sm" className="mt-3" onClick={() => setStep(Math.min(4, step + 1))}>Ulash</Button>
                  </AccordionItem>
                  <AccordionItem itemKey="ship" title="Yetkazib berish zonalari" startContent={<Truck size={18} className="text-success" />}>
                    <p className="text-sm text-muted">Toshkent bo'ylab bepul, viloyatlarga 25 000 so'mdan.</p>
                  </AccordionItem>
                  <AccordionItem itemKey="team" title="Jamoani taklif qilish" startContent={<Users size={18} className="text-warning" />}>
                    <p className="text-sm text-muted">Email orqali taklif yuboring va rollarni belgilang.</p>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Bildirishnoma sozlamalari" description="Qaysi xabarlarni olishni tanlang" />
              <CardBody className="space-y-5">
                <div className="divide-y divide-separator rounded-2xl bg-surface-secondary px-4">
                  {[
                    { label: "Yangi buyurtmalar", desc: "Har bir buyurtma haqida darhol", on: true },
                    { label: "Kunlik hisobot", desc: "Har kuni 09:00 da email", on: true },
                    { label: "Marketing xabarlari", desc: "Yangiliklar va takliflar", on: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.label}</p>
                        <p className="text-xs text-muted">{s.desc}</p>
                      </div>
                      <Switch defaultSelected={s.on} aria-label={s.label} />
                    </div>
                  ))}
                </div>
                <CheckboxGroup label="Kanallar" orientation="horizontal" defaultValue={["email", "bot"]} variant="secondary">
                  <Checkbox value="email">Email</Checkbox>
                  <Checkbox value="sms">SMS</Checkbox>
                  <Checkbox value="bot">Chat bot</Checkbox>
                  <Checkbox value="push">Push</Checkbox>
                </CheckboxGroup>
                <RadioGroup label="Hisobot chastotasi" orientation="horizontal" defaultValue="daily" variant="secondary">
                  <Radio value="daily">Kunlik</Radio>
                  <Radio value="weekly">Haftalik</Radio>
                  <Radio value="monthly">Oylik</Radio>
                </RadioGroup>
              </CardBody>
              <CardFooter showDivider className="justify-end">
                <Button variant="tertiary">Bekor qilish</Button>
                <Button onClick={() => addToast({ title: "Sozlamalar saqlandi", color: "success" })}>Saqlash</Button>
              </CardFooter>
            </Card>
          </div>

          <p className="pb-4 text-center text-xs text-muted">
            Bu sahifa to'liq <code className="font-mono">nr-ui-kit</code> komponentlari bilan qurilgan · <a href="/" className="text-accent hover:underline">Hujjatlar</a>
          </p>
        </main>
      </div>

      <NewOrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
