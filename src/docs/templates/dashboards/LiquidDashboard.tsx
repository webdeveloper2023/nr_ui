import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRight, BarChart3, BookOpen, DollarSign, Download, Folder, Heart, LayoutDashboard, MessageSquare,
  Package, PanelLeft, Plus, RefreshCw, Search, ShoppingBag, Sparkles, Star, TrendingUp, Truck, Users, Zap,
  AlertTriangle, CheckCircle2, Clock,
} from "lucide-react";
import {
  Avatar, AvatarGroup, Badge, Button, Card, Chip, CircularProgress, ChatContainer, ChatMessage, Input,
  Pagination, Progress, PromptInput, Skeleton, Sparkline, Spinner, StatCard, Table, Tabs, Timeline, Tooltip,
  useToast,
} from "nr-ui-kit";
import { ThemeButton, Notifications, UserMenu, CardMenu, NewOrderModal, UpgradeModal } from "./shared";
import { STATUS, ORDERS, REVENUE, TEAM, PAGE_SIZE, avatarUrl, type Order, type Status } from "./data";
import { useDesignStyle } from "../../designStyle";
import { DesignStyleSwitch } from "../../DesignStyleSwitch";

// Liquid (clear glass): vivid wallpaper, floating capsule chrome,
// large-radius widgets. Every glass surface opts into material="liquid".
const M = "liquid" as const;

const NAV = [
  { key: "home", label: "Bosh sahifa", short: "Bosh", icon: LayoutDashboard },
  { key: "orders", label: "Buyurtmalar", short: "Buyurtma", icon: ShoppingBag },
  { key: "products", label: "Mahsulotlar", short: "Mahsulot", icon: Package },
  { key: "customers", label: "Mijozlar", short: "Mijoz", icon: Users },
  { key: "analytics", label: "Analitika", short: "Tahlil", icon: BarChart3 },
];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

/** Photographic-feeling CSS wallpaper: saturated bright color fields + fine texture. */
function Wallpaper() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#dfe7f5] dark:bg-[#05060b]">
      <div className="absolute -left-[12%] -top-[18%] h-[70vh] w-[60vw] rounded-full bg-blue opacity-80 blur-[90px] dark:opacity-60" />
      <div className="absolute right-[-10%] top-[-8%] h-[60vh] w-[50vw] rounded-full bg-purple opacity-70 blur-[100px] dark:opacity-55" />
      <div className="absolute left-[28%] top-[30%] h-[55vh] w-[45vw] rounded-full bg-pink opacity-55 blur-[110px] dark:opacity-40" />
      <div className="absolute bottom-[-20%] left-[-6%] h-[60vh] w-[48vw] rounded-full bg-mint opacity-70 blur-[100px] dark:opacity-40" />
      <div className="absolute bottom-[-18%] right-[2%] h-[55vh] w-[42vw] rounded-full bg-orange opacity-60 blur-[110px] dark:opacity-40" />
      <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_60%_40%,transparent,rgb(255_255_255/0.25),transparent_35%)] dark:bg-[conic-gradient(from_210deg_at_60%_40%,transparent,rgb(255_255_255/0.05),transparent_35%)]" />
      {/* fine stripes so the lensing / blur of Liquid is visible */}
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.05] [background-image:repeating-linear-gradient(115deg,#fff_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay dark:opacity-[0.12]" style={{ backgroundImage: NOISE }} />
    </div>
  );
}

/** A floating Liquid capsule. */
function Capsule({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-glass={M} className={`glass flex items-center gap-1 rounded-full p-1.5 ${className}`}>
      {children}
    </div>
  );
}

function TabBar({ active, onChange, compact = false }: { active: string; onChange: (k: string) => void; compact?: boolean }) {
  return (
    <Capsule>
      <nav aria-label="Asosiy navigatsiya" className="flex items-center gap-0.5">
        {NAV.map(({ key, label, short, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className={[
                "flex items-center gap-2 rounded-full font-medium transition-all duration-300 ease-(--ease-out-soft) cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus",
                compact ? "h-12 w-[62px] flex-col justify-center gap-0.5 text-[10px]" : "h-10 px-4 text-sm",
                isActive
                  ? "bg-white/70 text-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_2px_10px_rgb(0_0_0/0.08)] dark:bg-white/15 dark:text-white dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
                  : "text-foreground/75 hover:bg-white/30 hover:text-foreground dark:hover:bg-white/10",
              ].join(" ")}
            >
              <Icon size={compact ? 18 : 16} strokeWidth={isActive ? 2.4 : 2} />
              <span className={compact ? "" : "hidden lg:inline"}>{compact ? short : label}</span>
            </button>
          );
        })}
      </nav>
    </Capsule>
  );
}

/** Large-radius tablet-style widget. */
function Widget({ children, className = "", title, subtitle, end }: { children: ReactNode; className?: string; title?: ReactNode; subtitle?: ReactNode; end?: ReactNode }) {
  return (
    <Card variant="glass" material={M} className={`rounded-[32px]! p-5 sm:p-6 ${className}`}>
      {(title || end) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <p className="text-[17px] font-semibold tracking-tight text-foreground">{title}</p>}
            {subtitle && <p className="mt-0.5 text-sm text-foreground/65">{subtitle}</p>}
          </div>
          {end}
        </div>
      )}
      {children}
    </Card>
  );
}

function SourceList({ open, nav, onNav, onUpgrade }: { open: boolean; nav: string; onNav: (k: string) => void; onUpgrade: () => void }) {
  const item = (key: string, label: string, icon: ReactNode, badge?: ReactNode) => (
    <button
      key={key}
      onClick={() => onNav(key)}
      className={[
        "flex h-9 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors cursor-pointer",
        nav === key ? "bg-white/60 font-medium text-foreground dark:bg-white/12" : "text-foreground/75 hover:bg-white/30 dark:hover:bg-white/8",
      ].join(" ")}
    >
      <span className={nav === key ? "text-accent" : ""}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge}
    </button>
  );
  return (
    <aside
      data-glass={M}
      aria-hidden={!open}
      className={[
        "glass fixed left-4 top-24 bottom-4 z-30 hidden w-64 flex-col rounded-[28px] p-3 xl:flex",
        "transition-[transform,opacity] duration-500 ease-(--ease-out-soft)",
        open ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <p className="px-3 pb-1 pt-2 text-xs font-semibold text-foreground/55">Do'kon</p>
      {NAV.map((n) => item(n.key, n.label, <n.icon size={16} />, n.key === "orders" ? <Chip size="sm" variant="soft" color="accent">8</Chip> : undefined))}
      <p className="px-3 pb-1 pt-4 text-xs font-semibold text-foreground/55">To'plamlar</p>
      {item("fav", "Sevimlilar", <Heart size={16} />)}
      {item("vip", "VIP mijozlar", <Star size={16} />)}
      {item("files", "Fayllar", <Folder size={16} />)}
      {item("messages", "Xabarlar", <MessageSquare size={16} />, <Chip size="sm" color="danger" variant="primary">3</Chip>)}
      <a href="/" className="flex h-9 items-center gap-3 rounded-xl px-3 text-sm text-foreground/75 hover:bg-white/30 dark:hover:bg-white/8">
        <BookOpen size={16} /> Hujjatlar
      </a>
      <div className="mt-auto rounded-[22px] bg-white/40 p-4 dark:bg-white/8">
        <p className="text-sm font-semibold text-foreground">Pro'ga o'ting</p>
        <p className="mt-0.5 text-xs text-foreground/65">AI va cheksiz buyurtmalar</p>
        <Progress value={72} size="sm" className="mt-3" label="Limit" showValueLabel />
        <Button size="sm" radius="full" fullWidth className="mt-3" onClick={onUpgrade}>Yangilash</Button>
      </div>
    </aside>
  );
}

export default function LiquidDashboard() {
  const [designStyle, setDesignStyle] = useDesignStyle();
  const { addToast } = useToast();
  const [nav, setNav] = useState("home");
  const [sourceOpen, setSourceOpen] = useState(true);
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "user", text: "Bugun nimaga e'tibor beray?" },
    { role: "assistant", text: "2 ta buyurtma kutilmoqda va Wireless earbuds zaxirasi 4 donaga tushdi. Ularni jo'natib, zaxirani to'ldirsangiz haftalik maqsadga 96% yetasiz." },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const toast = (title: string, color: "success" | "accent" | "danger" | "warning" = "success", icon?: ReactNode) =>
    addToast({ title, color, icon, material: M, timeout: 2800 });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Ma'lumotlar yangilandi");
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
      setMessages((m) => [...m, { role: "assistant", text: "Tayyor: eng faol 5 mijozga shaxsiy chegirma taklifini yuborish konversiyani taxminan +0.6% oshiradi." }]);
      setChatLoading(false);
    }, 1400);
  };

  return (
    <div className="relative min-h-screen text-foreground">
      <Wallpaper />

      {/* ━━━ Floating chrome ━━━ */}
      <header className="fixed inset-x-0 top-4 z-40 flex items-center justify-between gap-3 px-4">
        <Capsule className="sm:pr-4">
          <div className="hidden xl:block">
            <Tooltip content={sourceOpen ? "Panelni yashirish" : "Panelni ko'rsatish"} placement="bottom" material={M}>
              <Button isIconOnly radius="full" variant="glass" material={M} aria-label="Panel" onClick={() => setSourceOpen(!sourceOpen)}>
                <PanelLeft size={17} />
              </Button>
            </Tooltip>
          </div>
          <span className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue to-indigo text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]">
            <Zap size={16} />
          </span>
          <span className="ml-1.5 hidden text-[15px] font-semibold tracking-tight sm:inline">Acme Store</span>
        </Capsule>

        <div className="hidden md:block">
          <TabBar active={nav} onChange={setNav} />
        </div>

        <Capsule>
          <div className="hidden sm:block">
            <Tooltip content="Qidirish" placement="bottom" material={M}>
              <Button isIconOnly radius="full" variant="ghost" aria-label="Qidirish" onClick={() => document.getElementById("liquid-search")?.focus()}>
                <Search size={17} />
              </Button>
            </Tooltip>
          </div>
          <DesignStyleSwitch style={designStyle} onChange={setDesignStyle} />
          <Notifications />
          <ThemeButton />
          <div className="pl-1 pr-0.5"><UserMenu /></div>
        </Capsule>
      </header>

      {/* Modern style bottom tab bar on small screens */}
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden">
        <TabBar active={nav} onChange={setNav} compact />
      </div>

      <SourceList open={sourceOpen} nav={nav} onNav={setNav} onUpgrade={() => setUpgradeOpen(true)} />

      {/* ━━━ Content ━━━ */}
      <main className={`mx-auto max-w-[1440px] px-4 pb-32 pt-28 transition-[padding] duration-500 ease-(--ease-out-soft) sm:px-6 md:pb-12 ${sourceOpen ? "xl:pl-[300px]" : "xl:pl-8"}`}>
        {/* Greeting */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground/70">Seshanba, 27 oktyabr</p>
            <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight text-foreground sm:text-[40px]">Xayrli kech, Rafiqjon</h1>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="Yangilash" material={M}>
              <Button isIconOnly radius="full" variant="glass" material={M} onClick={refresh} aria-label="Yangilash">
                {loading ? <Spinner size="sm" color="current" /> : <RefreshCw size={16} />}
              </Button>
            </Tooltip>
            <Button radius="full" variant="glass" material={M} startContent={<Download size={16} />} onClick={() => toast("Hisobot yuklab olinmoqda", "accent", <Download size={16} />)}>
              Eksport
            </Button>
            <Button radius="full" startContent={<Plus size={16} />} onClick={() => setOrderOpen(true)}>Yangi buyurtma</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Revenue — the hero widget */}
          <Widget
            className="lg:col-span-8"
            title="Daromad"
            subtitle={
              <span className="flex items-center gap-2">
                <span className="text-[28px] font-bold tracking-tight text-foreground tabular-nums">{revenue.total}</span>
                <Chip size="sm" variant="glass" material={M} color="success" startContent={<ArrowUpRight size={12} />}>{revenue.change}</Chip>
              </span>
            }
            end={
              <Tabs
                size="sm"
                isBlurred
                material={M}
                selectedKey={range}
                onSelectionChange={setRange}
                tabs={[
                  { key: "week", title: "7 kun" },
                  { key: "month", title: "30 kun" },
                  { key: "year", title: "12 oy" },
                ]}
              />
            }
          >
            <Skeleton isLoaded={!loading} className="h-56 rounded-3xl">
              <Sparkline data={revenue.data} height={224} color="accent" showArea />
            </Skeleton>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Onlayn", value: "$31,420", dot: "bg-blue" },
                { label: "Do'kon", value: "$12,610", dot: "bg-green" },
                { label: "Ulgurji", value: "$4,200", dot: "bg-orange" },
              ].map((s) => (
                <span key={s.label} data-glass={M} className="glass-thin flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className="text-foreground/70">{s.label}</span>
                  <span className="font-semibold tabular-nums">{s.value}</span>
                </span>
              ))}
            </div>
          </Widget>

          {/* Goals ring */}
          <Widget className="lg:col-span-4" title="Oylik maqsad" subtitle="Oktyabr, 2026" end={<CardMenu />}>
            <div className="flex flex-col items-center py-2">
              <CircularProgress value={78} size="xl" strokeWidth={10} color="accent" showValueLabel />
              <p className="mt-3 text-sm text-foreground/70">$48.2k / $62k sotuv</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Mijozlar", value: "68%", color: "text-green" },
                { label: "Qaytarish", value: "18%", color: "text-red" },
                { label: "Ombor", value: "55%", color: "text-orange" },
              ].map((g) => (
                <div key={g.label} className="rounded-2xl bg-white/35 px-2 py-3 text-center dark:bg-white/8">
                  <p className={`text-lg font-bold tabular-nums ${g.color}`}>{g.value}</p>
                  <p className="text-[11px] text-foreground/65">{g.label}</p>
                </div>
              ))}
            </div>
          </Widget>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 lg:gap-5 xl:grid-cols-4">
            {[
              { title: "Daromad", value: "$48,230", change: 12.5, color: "accent" as const, icon: <DollarSign size={16} />, chart: [22, 28, 25, 31, 36, 33, 40, 44] },
              { title: "Buyurtmalar", value: "1,284", change: 8.2, color: "success" as const, icon: <ShoppingBag size={16} />, chart: [12, 15, 14, 18, 17, 21, 24, 23] },
              { title: "Yangi mijozlar", value: "342", change: -3.1, color: "warning" as const, icon: <Users size={16} />, chart: [30, 28, 31, 27, 26, 25, 27, 24] },
              { title: "Konversiya", value: "3.8%", change: 1.7, color: "danger" as const, icon: <TrendingUp size={16} />, progress: 64 },
            ].map((k) => (
              <Skeleton key={k.title} isLoaded={!loading} className="h-full rounded-[28px]">
                <StatCard
                  variant="glass"
                  material={M}
                  className="h-full rounded-[28px]!"
                  title={k.title}
                  value={k.value}
                  change={k.change}
                  color={k.color}
                  icon={k.icon}
                  chartData={k.chart}
                  progress={k.progress}
                />
              </Skeleton>
            ))}
          </div>

          {/* Orders */}
          <Widget
            className="lg:col-span-8"
            title="Buyurtmalar"
            subtitle={`${filtered.length} ta buyurtma`}
            end={
              <Input
                id="liquid-search"
                size="sm"
                radius="full"
                placeholder="Qidirish..."
                startContent={<Search size={14} />}
                value={query}
                onValueChange={(v) => { setQuery(v); setPage(1); }}
                isClearable
                onClear={() => setQuery("")}
                className="w-44 sm:w-60"
                classNames={{ inputWrapper: "bg-white/50! dark:bg-white/10! shadow-none!" }}
                aria-label="Buyurtmalarni qidirish"
              />
            }
          >
            <div className="mb-3 overflow-x-auto">
              <Tabs
                size="sm"
                isBlurred
                material={M}
                selectedKey={status}
                onSelectionChange={(k) => { setStatus(k); setPage(1); }}
                tabs={[{ key: "all", title: "Barchasi" }, ...Object.entries(STATUS).map(([key, s]) => ({ key, title: s.label }))]}
              />
            </div>
            <Table<Order>
              aria-label="Buyurtmalar"
              keyField="id"
              rows={rows}
              isBlurred
              material={M}
              isLoading={loading}
              className="rounded-[24px]!"
              emptyContent={<div className="py-10 text-center text-sm text-foreground/65">Hech narsa topilmadi</div>}
              bottomContent={
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground/65">Sahifa {page} / {pages}</p>
                  <Pagination total={pages} page={page} onChange={setPage} size="sm" />
                </div>
              }
              columns={[
                {
                  key: "customer",
                  label: "Mijoz",
                  sortable: true,
                  render: (_v, r) => (
                    <div className="flex items-center gap-3">
                      <Avatar src={avatarUrl(r.email)} name={r.customer} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{r.customer}</p>
                        <p className="truncate font-mono text-[11px] text-foreground/60">{r.id}</p>
                      </div>
                    </div>
                  ),
                },
                { key: "product", label: "Mahsulot" },
                { key: "amount", label: "Summa", sortable: true, align: "end", render: (v) => <span className="font-semibold tabular-nums">${Number(v).toLocaleString("en-US")}</span> },
                { key: "status", label: "Holat", render: (v) => <Chip size="sm" variant="glass" material={M} dot color={STATUS[v as Status].color}>{STATUS[v as Status].label}</Chip> },
                {
                  key: "actions",
                  label: "",
                  align: "end",
                  render: (_v, r) => (
                    <Tooltip content="Jo'natish" material={M}>
                      <Button isIconOnly size="sm" radius="full" variant="glass" material={M} aria-label="Jo'natish" onClick={() => toast(`${r.id} jo'natildi`, "accent", <Truck size={16} />)}>
                        <Truck size={14} />
                      </Button>
                    </Tooltip>
                  ),
                },
              ]}
            />
          </Widget>

          {/* Now — live activity */}
          <Widget
            className="lg:col-span-4"
            title={
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
                </span>
                Hozir
              </span>
            }
            subtitle="Jonli faollik"
            end={
              <AvatarGroup max={3} size="sm">
                {TEAM.map((m) => <Avatar key={m.name} src={avatarUrl(m.name)} name={m.name} />)}
              </AvatarGroup>
            }
          >
            <Timeline
              items={[
                { id: "l1", title: <><b className="font-medium">Dilnoza</b> #3209 ni jo'natdi</>, time: "10 daq", color: "accent", icon: <Truck size={14} /> },
                { id: "l2", title: "To'lov qabul qilindi", description: "Click · $599", time: "1 soat", color: "success", icon: <CheckCircle2 size={14} /> },
                { id: "l3", title: "Zaxira kam qoldi", description: "Wireless earbuds — 4 dona", time: "3 soat", color: "warning", icon: <AlertTriangle size={14} /> },
                { id: "l4", title: <><b className="font-medium">Jasur</b> 12 ta mahsulot qo'shdi</>, time: "5 soat", icon: <Package size={14} /> },
              ]}
            />
            <div className="mt-4 space-y-1">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-white/30 dark:hover:bg-white/8">
                  <Badge isDot color={m.online ? "success" : "default"} placement="bottom-right">
                    <Avatar src={avatarUrl(m.name)} name={m.name} size="sm" />
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-foreground/60">{m.role}</p>
                  </div>
                  <Clock size={14} className="text-foreground/40" />
                </div>
              ))}
            </div>
          </Widget>

          {/* AI assistant — floating composer */}
          <Widget
            className="flex flex-col lg:col-span-7"
            title={<span className="flex items-center gap-2"><Sparkles size={17} className="text-purple" /> AI yordamchi</span>}
            subtitle="Savdo bo'yicha savol bering"
            end={<Chip size="sm" variant="glass" material={M} color="success" dot>Onlayn</Chip>}
          >
            <ChatContainer className="h-60 flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <ChatMessage key={i} role={m.role} showActions={m.role === "assistant"}>{m.text}</ChatMessage>
              ))}
              {chatLoading && <ChatMessage role="assistant" isTyping />}
            </ChatContainer>
            <PromptInput
              className="mt-4"
              isBlurred
              material={M}
              onSubmit={sendChat}
              isLoading={chatLoading}
              onStop={() => setChatLoading(false)}
              minRows={1}
              suggestions={["Haftalik hisobot", "Eng yaxshi mijozlar"]}
            />
          </Widget>

          {/* Promo + quick actions */}
          <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
            <Card variant="glass" material={M} isPressable onPress={() => setUpgradeOpen(true)} className="relative overflow-hidden rounded-[32px]! p-6">
              <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue to-purple opacity-50 blur-2xl" />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-indigo text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]">
                  <Sparkles size={20} />
                </span>
                <p className="mt-4 text-xl font-bold tracking-tight">Pro — 14 kun bepul</p>
                <p className="mt-1 text-sm text-foreground/70">AI yordamchi, kengaytirilgan analitika va cheksiz buyurtmalar.</p>
                <div className="mt-5 flex items-center gap-3">
                  <Button radius="full" onClick={() => setUpgradeOpen(true)}>Sinab ko'rish</Button>
                  <span className="text-sm font-medium text-foreground/70">$29 / oy</span>
                </div>
              </div>
            </Card>

            <Widget title="Tezkor amallar" className="flex-1">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Buyurtma", icon: <Plus size={18} />, run: () => setOrderOpen(true) },
                  { label: "Mahsulot", icon: <Package size={18} />, run: () => toast("Mahsulot qo'shish oynasi", "accent") },
                  { label: "Xabar", icon: <MessageSquare size={18} />, run: () => toast("3 ta yangi xabar", "accent") },
                  { label: "Hisobot", icon: <BarChart3 size={18} />, run: () => toast("Hisobot tayyorlanmoqda", "accent") },
                ].map((a) => (
                  <Button key={a.label} variant="glass" material={M} radius="full" size="lg" startContent={a.icon} onClick={a.run} className="justify-start bg-white/40! dark:bg-white/10!">
                    {a.label}
                  </Button>
                ))}
              </div>
            </Widget>
          </div>
        </div>
      </main>

      <NewOrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
