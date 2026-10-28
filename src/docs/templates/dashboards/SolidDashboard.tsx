import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, CreditCard, DollarSign, Download, Eye, FolderOpen,
  LayoutDashboard, MessageSquare, Package, Pencil, Plus, RefreshCw, Search, Settings, ShoppingBag, Sparkles,
  Trash2, TrendingUp, Truck, Users, Zap, AlertTriangle
} from "lucide-react";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody,
  CardFooter, CardHeader, ChatContainer, ChatMessage, Checkbox, CheckboxGroup, Chip, CircularProgress,
  Divider, Input, Kbd, Navbar, NavbarBrand, NavbarContent, NavbarItem, Pagination, Progress, PromptInput,
  Radio, RadioGroup, Rating, Select, Sidebar, SidebarItem, SidebarSection, Skeleton, Sparkline, Spinner,
  StatCard, Stepper, Switch, Table, Tabs, Timeline, Tooltip, useToast
} from "nr-ui-kit";

import { ThemeButton, Notifications, UserMenu, CardMenu, NewOrderModal, UpgradeModal } from "./shared";
import { STATUS, ORDERS, REVENUE, TEAM, PAGE_SIZE, avatarUrl, type Order, type Status } from "./data";
import { useDesignStyle } from "../../designStyle";
import { DesignStyleSwitch } from "../../DesignStyleSwitch";

// ─── Page ───────────────────────────────────
export default function SolidDashboard() {
  const [designStyle, setDesignStyle] = useDesignStyle();
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
            <NavbarItem><DesignStyleSwitch style={designStyle} onChange={setDesignStyle} /></NavbarItem>
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
