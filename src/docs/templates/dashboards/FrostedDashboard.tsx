import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, Crown, DollarSign, Download, FolderOpen, LayoutDashboard,
  MessageSquare, Package, Plus, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Sunrise, Trash2,
  TrendingUp, Truck, Users, Zap, AlertTriangle,
} from "lucide-react";
import {
  Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardHeader, ChatContainer, ChatMessage, Chip,
  CircularProgress, Input, Pagination, Progress, PromptInput, Sidebar, SidebarItem, SidebarSection, Sparkline,
  StatCard, Table, Tabs, Timeline, useToast,
} from "nr-ui-kit";
import { ThemeButton, Notifications, UserMenu, CardMenu, NewOrderModal, UpgradeModal } from "./shared";
import { STATUS, ORDERS, REVENUE, TEAM, PAGE_SIZE, avatarUrl, type Order, type Status } from "./data";
import { useDesignStyle } from "../../designStyle";
import { DesignStyleSwitch } from "../../DesignStyleSwitch";

// ─── Wallpaper ──────────────────────────────
// Vivid desktop-style wallpaper (CSS only) — everything else floats on frosted panels above it.
function Wallpaper() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#cfe0ff] via-[#eadcff] to-[#d3f3ee] dark:from-[#070b1f] dark:via-[#140a28] dark:to-[#03161a]" />
      <div className="absolute -left-40 -top-40 size-[44rem] rounded-full bg-blue opacity-55 blur-[120px] dark:opacity-45" />
      <div className="absolute right-[-10rem] top-[-6rem] size-[40rem] rounded-full bg-purple opacity-45 blur-[120px] dark:opacity-40" />
      <div className="absolute bottom-[-14rem] left-1/4 size-[42rem] rounded-full bg-teal opacity-45 blur-[130px] dark:opacity-30" />
      <div className="absolute bottom-[-8rem] right-[-6rem] size-[34rem] rounded-full bg-pink opacity-40 blur-[120px] dark:opacity-30" />
      <div className="absolute left-1/2 top-1/3 size-[22rem] -translate-x-1/2 rounded-full bg-indigo opacity-30 blur-[100px]" />
    </div>
  );
}

const STATUS_TABS = [
  { key: "all", title: "Barchasi" },
  ...Object.entries(STATUS).map(([key, s]) => ({ key, title: s.label })),
];

// ─── Page ───────────────────────────────────
export default function FrostedDashboard() {
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
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "user", text: "Bugun nechta buyurtma keldi?" },
    { role: "assistant", text: "Bugun 24 ta buyurtma — kechagidan 18% ko'p. 2 tasi jo'natishni kutmoqda." },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({ title: "Ma'lumotlar yangilandi", color: "success" });
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
  const revenue = REVENUE[range];

  const sendChat = (text: string) => {
    setMessages((m) => [...m, { role: "user", text }]);
    setChatLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: "Eng ko'p sotilgan: Laptop Pro 14 — 31% daromad. Zaxirani 10 donaga oshirishni tavsiya qilaman." }]);
      setChatLoading(false);
    }, 1400);
  };

  return (
    <div className="relative h-screen overflow-hidden text-foreground">
      <Wallpaper />

      <div className="relative flex h-full gap-4 p-3 sm:p-4">
        {/* ━━━ Floating frosted sidebar ━━━ */}
        <Sidebar
          isBlurred
          material="frosted"
          className="hidden lg:flex h-full !border-0 rounded-3xl overflow-hidden"
          selectedKey={nav}
          onSelect={setNav}
          header={
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-indigo text-white shadow-md">
                <Zap size={16} />
              </span>
              <span className="font-semibold text-foreground">Acme Store</span>
            </div>
          }
          footer={
            <div className="rounded-2xl glass-thin p-3">
              <div className="flex items-center gap-2">
                <Crown size={15} className="text-warning" />
                <p className="text-sm font-medium text-foreground">Pro'ga o'ting</p>
              </div>
              <Progress value={72} size="sm" className="mt-3" label="Limit" showValueLabel />
              <Button size="sm" variant="glass" fullWidth className="mt-3" onClick={() => setUpgradeOpen(true)}>Yangilash</Button>
            </div>
          }
        >
          <SidebarSection title="Asosiy">
            <SidebarItem itemKey="dashboard" icon={<LayoutDashboard size={18} />} title="Dashboard" />
            <SidebarItem itemKey="orders" icon={<ShoppingBag size={18} />} title="Buyurtmalar" endContent={<Chip size="sm" variant="glass" color="accent">8</Chip>}>
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

        {/* ━━━ Main column ━━━ */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Toolbar */}
          <header data-glass="frosted" className="glass flex h-16 shrink-0 items-center gap-3 rounded-3xl px-4 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">Dashboard</p>
              <p className="hidden sm:block text-xs text-muted">Seshanba, 27 oktyabr</p>
            </div>
            <div className="mx-auto hidden w-full max-w-sm md:block">
              <Input
                size="sm"
                radius="full"
                variant="secondary"
                placeholder="Qidirish..."
                aria-label="Qidirish"
                startContent={<Search size={14} />}
                value={query}
                onValueChange={(v) => { setQuery(v); setPage(1); }}
              />
            </div>
            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <DesignStyleSwitch style={designStyle} onChange={setDesignStyle} className="hidden sm:flex" />
              <Notifications />
              <ThemeButton />
              <UserMenu />
            </div>
          </header>

          {/* Widgets */}
          <main className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-3xl pb-2">
            {/* Hero + goals */}
            <div className="grid gap-4 xl:grid-cols-3">
              <Card variant="glass" material="frosted" className="xl:col-span-2">
                <CardBody className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Chip size="sm" variant="glass" startContent={<Sunrise size={13} className="text-warning" />}>Xayrli tong</Chip>
                      <h1 className="mt-3 text-[28px] font-semibold tracking-tight text-foreground">Salom, Rafiqjon</h1>
                      <p className="mt-1 text-sm text-muted">Bugun do'koningiz rekord tomon ketyapti — kechagidan 18% ko'p savdo.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="glass" isIconOnly aria-label="Yangilash" onClick={refresh}><RefreshCw size={16} /></Button>
                      <Button variant="glass" startContent={<Download size={16} />} onClick={() => addToast({ title: "Hisobot tayyorlanmoqda", description: "PDF bir necha soniyada yuklanadi", color: "accent" })}>Eksport</Button>
                      <Button startContent={<Plus size={16} />} onClick={() => setOrderOpen(true)}>Yangi buyurtma</Button>
                    </div>
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Bugungi daromad", value: "$3,420", change: "+18%", icon: <DollarSign size={16} />, tint: "from-blue/25" },
                      { label: "Buyurtmalar", value: "24", change: "+6", icon: <ShoppingBag size={16} />, tint: "from-green/25" },
                      { label: "Tashrif buyuruvchilar", value: "1,982", change: "+9%", icon: <Users size={16} />, tint: "from-purple/25" },
                    ].map((k) => (
                      <div key={k.label} className={`rounded-2xl glass-thin bg-gradient-to-br ${k.tint} to-transparent p-4`}>
                        <div className="flex items-center justify-between text-muted">
                          <span className="text-xs font-medium">{k.label}</span>
                          {k.icon}
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <span className="text-2xl font-semibold tabular-nums text-foreground">{k.value}</span>
                          <Chip size="sm" variant="glass" color="success" startContent={<ArrowUpRight size={12} />}>{k.change}</Chip>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card variant="glass" material="frosted">
                <CardHeader title="Oylik maqsadlar" description="Oktyabr, 2026" endContent={<CardMenu />} />
                <CardBody className="space-y-5">
                  <div className="flex items-center gap-4 rounded-2xl glass-thin p-4">
                    <CircularProgress value={78} size="lg" color="accent" showValueLabel />
                    <div>
                      <p className="text-sm font-medium text-foreground">Sotuv rejasi</p>
                      <p className="text-xs text-muted">$48.2k / $62k</p>
                    </div>
                  </div>
                  <Progress label="Yangi mijozlar" value={342} maxValue={500} showValueLabel color="success" />
                  <Progress label="Ombor to'ldirish" value={55} showValueLabel color="warning" />
                </CardBody>
              </Card>
            </div>

            {/* KPI */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Daromad", value: "$48,230", change: 12.5, color: "accent" as const, icon: <DollarSign size={16} />, chart: [22, 28, 25, 31, 36, 33, 40, 44] },
                { title: "Buyurtmalar", value: "1,284", change: 8.2, color: "success" as const, icon: <ShoppingBag size={16} />, chart: [12, 15, 14, 18, 17, 21, 24, 23] },
                { title: "Yangi mijozlar", value: "342", change: -3.1, color: "warning" as const, icon: <Users size={16} />, chart: [30, 28, 31, 27, 26, 25, 27, 24] },
                { title: "Konversiya", value: "3.8%", change: 1.7, color: "danger" as const, icon: <TrendingUp size={16} />, progress: 64 },
              ].map((k) => (
                <StatCard key={k.title} variant="glass" material="frosted" title={k.title} value={k.value} change={k.change} color={k.color} icon={k.icon} chartData={k.chart} progress={k.progress} actions={<CardMenu />} />
              ))}
            </div>

            {/* Revenue + AI */}
            <div className="grid gap-4 xl:grid-cols-3">
              <Card variant="glass" material="frosted" className="xl:col-span-2">
                <CardHeader
                  title="Daromad dinamikasi"
                  description={<span className="flex items-center gap-2">{revenue.total} <Chip size="sm" variant="glass" color="success" startContent={<ArrowUpRight size={12} />}>{revenue.change}</Chip></span>}
                  endContent={
                    <Tabs
                      size="sm"
                      isBlurred
                      material="frosted"
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
                  <Sparkline data={revenue.data} height={276} color="accent" showArea className="w-full" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: "Onlayn", value: "$31,420", color: "bg-blue" },
                      { label: "Do'kon", value: "$12,610", color: "bg-green" },
                      { label: "Ulgurji", value: "$4,200", color: "bg-orange" },
                    ].map((s) => (
                      <span key={s.label} className="flex items-center gap-2 rounded-full glass-thin px-3 py-1.5 text-sm">
                        <span className={`h-2 w-2 rounded-full ${s.color}`} />
                        <span className="text-muted">{s.label}</span>
                        <span className="font-medium tabular-nums text-foreground">{s.value}</span>
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card variant="glass" material="frosted" className="flex flex-col">
                <CardHeader
                  title={<span className="flex items-center gap-2"><Sparkles size={16} className="text-purple" /> AI yordamchi</span>}
                  description="Savdo bo'yicha savol bering"
                  endContent={<Chip size="sm" variant="glass" color="success" dot>Onlayn</Chip>}
                />
                <ChatContainer className="h-52 flex-1 space-y-4 overflow-y-auto px-4">
                  {messages.map((m, i) => (
                    <ChatMessage key={i} role={m.role} showActions={m.role === "assistant"}>{m.text}</ChatMessage>
                  ))}
                  {chatLoading && <ChatMessage role="assistant" isTyping />}
                </ChatContainer>
                <div className="p-3">
                  <PromptInput isBlurred material="frosted" onSubmit={sendChat} isLoading={chatLoading} onStop={() => setChatLoading(false)} minRows={1} suggestions={["Eng ko'p sotilgan", "Haftalik hisobot"]} />
                </div>
              </Card>
            </div>

            {/* Orders */}
            <Card variant="glass" material="frosted">
            <CardBody className="p-4">
            <Table<Order>
              aria-label="Buyurtmalar"
              removeWrapper
              keyField="id"
              rows={rows}
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={setSelected}
              isLoading={loading}
              topContent={
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">So'nggi buyurtmalar</p>
                    <p className="text-xs text-muted">{filtered.length} ta buyurtma{selected.size ? ` · ${selected.size} ta tanlangan` : ""}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tabs
                      size="sm"
                      isBlurred
                      material="frosted"
                      selectedKey={status}
                      onSelectionChange={(k) => { setStatus(k); setPage(1); }}
                      tabs={STATUS_TABS}
                    />
                    <Button
                      size="sm"
                      variant="glass"
                      isDisabled={!selected.size}
                      startContent={<Trash2 size={14} />}
                      onClick={() => { addToast({ title: `${selected.size} ta buyurtma o'chirildi`, color: "danger" }); setSelected(new Set()); }}
                    >
                      O'chirish
                    </Button>
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
                { key: "status", label: "Holat", render: (v) => <Chip size="sm" variant="glass" dot color={STATUS[v as Status].color}>{STATUS[v as Status].label}</Chip> },
                { key: "date", label: "Sana", render: (v) => <span className="text-muted">{String(v)}</span> },
                {
                  key: "actions",
                  label: "",
                  align: "end",
                  render: (_v, r) => (
                    <Button isIconOnly size="sm" variant="ghost" aria-label="Jo'natish" onClick={() => addToast({ title: `${r.id} jo'natildi`, icon: <Truck size={16} />, color: "accent" })}>
                      <Truck size={15} />
                    </Button>
                  ),
                },
              ]}
            />
            </CardBody>
            </Card>

            {/* Activity · Team · Promo */}
            <div className="grid gap-4 xl:grid-cols-3">
              <Card variant="glass" material="frosted">
                <CardHeader title="Faollik" description="So'nggi 24 soat" endContent={<Activity size={16} className="text-muted" />} />
                <CardBody>
                  <Timeline
                    items={[
                      { id: "a1", title: <><b className="font-medium">Dilnoza</b> #3209 ni jo'natdi</>, time: "10 daq", color: "accent", icon: <Truck size={14} /> },
                      { id: "a2", title: "To'lov qabul qilindi", description: "Click · $599", time: "1 soat", color: "success", icon: <DollarSign size={14} /> },
                      { id: "a3", title: <><b className="font-medium">Jasur</b> mahsulot qo'shdi</>, description: "5K display · 12 dona", time: "3 soat", icon: <Package size={14} /> },
                      { id: "a4", title: "Zaxira kam qoldi", description: "Wireless earbuds — 4 dona", time: "5 soat", color: "warning", icon: <AlertTriangle size={14} /> },
                    ]}
                  />
                </CardBody>
              </Card>

              <Card variant="glass" material="frosted">
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
                    <div key={m.name} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-white/30 dark:hover:bg-white/5">
                      <Badge isDot color={m.online ? "success" : "default"} placement="bottom-right">
                        <Avatar src={avatarUrl(m.name)} name={m.name} size="sm" />
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted">{m.role}</p>
                      </div>
                      <Button isIconOnly size="sm" variant="glass" aria-label="Xabar"><MessageSquare size={15} /></Button>
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card variant="glass" material="frosted" className="relative overflow-hidden">
                <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br from-blue to-purple opacity-40 blur-2xl" />
                <CardBody className="relative flex h-full flex-col p-6">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-indigo text-white shadow-lg">
                    <Crown size={20} />
                  </span>
                  <p className="mt-5 text-xl font-semibold tracking-tight text-foreground">Acme Pro</p>
                  <p className="mt-1 text-sm text-muted">AI tahlil, cheksiz buyurtmalar va kengaytirilgan hisobotlar — 14 kun bepul.</p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {["Cheksiz buyurtmalar", "AI yordamchi", "10 ta jamoa a'zosi"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{f}</li>
                    ))}
                  </ul>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                    <Button fullWidth onClick={() => setUpgradeOpen(true)}>Tariflar</Button>
                    <Button variant="glass" fullWidth onClick={() => addToast({ title: "Sinov muddati boshlandi", description: "14 kun · Pro imkoniyatlari ochildi", color: "success" })}>Sinash</Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <NewOrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
