import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, BarChart3, BookOpen, CreditCard, DollarSign, Download, Eye, FolderOpen,
  LayoutDashboard, MessageSquare, Package, Pencil, Plus, RefreshCw, Search, Settings, ShoppingBag, Sparkles,
  Trash2, TrendingUp, Truck, Users, Zap,
} from "lucide-react";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, BarChart, Badge, Button, ButtonGroup, Card, CardBody,
  CardHeader, ChatContainer, ChatMessage, Checkbox, CheckboxGroup, Chip, Container, Divider, Form,
  Grid, GridItem, Hide, Input, Kbd, LineChart, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu,
  NavbarMenuItem, NavbarMenuToggle, Pagination, PhoneInput, PieChart, PromptInput, Rating, ResponsiveProvider,
  Select, Show, Sidebar, SidebarItem, SidebarSection, Skeleton, Spinner, Stack, StatCard, Stepper, Switch, Table,
  Tabs, Textarea, Timeline, Tooltip, useToast,
} from "nr-ui-kit";

import { ThemeButton, Notifications, UserMenu, CardMenu, NewOrderModal, UpgradeModal } from "./dashboards/shared";
import {
  CATEGORIES, CHANNELS, DAILY, GOALS, ORDERS, PAGE_SIZE, RANGES, STATUS, TEAM, WEEKDAYS, WEEK_ORDERS,
  avatarUrl, formatDay, formatToday, type Order, type Status,
} from "./dashboards/data";
import { useLang, useT, type Tr } from "../i18n/lang";
import { LanguageSwitch } from "../LanguageSwitch";

const money = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 1 : 2).replace(/\.?0+$/, "")}K` : `$${v}`);
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Density = "sm" | "md" | "lg";

/** Sizes the whole page follows, from the density control in the header */
const DENSITY = {
  sm: { card: "sm", stat: "sm", field: "sm", button: "sm", small: "xs", chip: "xs", tabs: "xs", gap: "md", lineH: 200, barH: 180, pie: 170, radial: 170, chat: "h-52", avatar: "xs" },
  md: { card: "md", stat: "md", field: "md", button: "md", small: "sm", chip: "sm", tabs: "sm", gap: "lg", lineH: 240, barH: 220, pie: 200, radial: 210, chat: "h-64", avatar: "sm" },
  lg: { card: "lg", stat: "lg", field: "lg", button: "lg", small: "md", chip: "md", tabs: "md", gap: "xl", lineH: 300, barH: 260, pie: 240, radial: 240, chat: "h-80", avatar: "md" },
} as const;

const DENSITY_KEY = "nr-dashboard-density";

function useDensity(): [Density, (d: Density) => void] {
  const [density, setDensity] = useState<Density>(() => {
    try {
      const saved = localStorage.getItem(DENSITY_KEY);
      if (saved === "sm" || saved === "md" || saved === "lg") return saved;
    } catch { /* storage unavailable */ }
    return "sm";
  });
  const change = (d: Density) => {
    setDensity(d);
    try { localStorage.setItem(DENSITY_KEY, d); } catch { /* storage unavailable */ }
  };
  return [density, change];
}

export default function StoreDashboard() {
  const [lang, setLang] = useLang();
  const t = useT();
  const { addToast } = useToast();
  const [density, setDensity] = useDensity();
  const z = DENSITY[density];
  const densityLabel = t({ en: "Size", uz: "O'lcham", ru: "Размер" });
  const densitySwitch = (
    <Tabs
      size="xs"
      aria-label={densityLabel}
      selectedKey={density}
      onSelectionChange={(k) => setDensity(k as Density)}
      tabs={[
        { key: "sm", title: "S" },
        { key: "md", title: "M" },
        { key: "lg", title: "L" },
      ]}
    />
  );

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
  const [saving, setSaving] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string | Tr }[]>([
    { role: "user", text: { en: "What was the best-selling product this week?", uz: "Bu hafta eng ko'p sotilgan mahsulot qaysi?", ru: "Какой товар продавался лучше всего на этой неделе?" } },
    { role: "assistant", text: { en: "Laptop Pro 14 — 42 sales, 38% of total revenue. +12% vs last week.", uz: "Laptop Pro 14 — 42 ta sotuv, umumiy daromadning 38%. O'tgan haftaga nisbatan +12%.", ru: "Laptop Pro 14 — 42 продажи, 38% общей выручки. +12% к прошлой неделе." } },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({ title: t({ en: "Data refreshed", uz: "Ma'lumotlar yangilandi", ru: "Данные обновлены" }), color: "success", timeout: 2500 });
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
      setMessages((m) => [...m, { role: "assistant", text: { en: "Analysis done: ship the 2 pending orders today and you'll reach 96% of the weekly goal.", uz: "Tahlil qildim: kutilayotgan 2 ta buyurtmani bugun jo'natsangiz, haftalik maqsadga 96% yetasiz.", ru: "Анализ готов: отправьте сегодня 2 ожидающих заказа — и выполните недельный план на 96%." } }]);
      setChatLoading(false);
    }, 1400);
  };

  // Revenue for the visible window of the line chart
  const [r0, r1] = RANGES[range];
  const windowRows = DAILY.slice(r0, r1 + 1);
  const windowTotal = windowRows.reduce((a, d) => a + d.revenue, 0);
  const windowPrev = windowRows.reduce((a, d) => a + d.previous, 0);
  const growth = ((windowTotal / windowPrev - 1) * 100).toFixed(1);

  const navItems = [
    { key: "dashboard", icon: <LayoutDashboard size={18} />, title: t({ en: "Dashboard", uz: "Dashboard", ru: "Дашборд" }) },
    { key: "orders", icon: <ShoppingBag size={18} />, title: t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" }) },
    { key: "products", icon: <Package size={18} />, title: t({ en: "Products", uz: "Mahsulotlar", ru: "Товары" }) },
    { key: "customers", icon: <Users size={18} />, title: t({ en: "Customers", uz: "Mijozlar", ru: "Клиенты" }) },
    { key: "analytics", icon: <BarChart3 size={18} />, title: t({ en: "Analytics", uz: "Analitika", ru: "Аналитика" }) },
  ];

  return (
    <ResponsiveProvider>
      <div className="relative flex h-screen bg-background">

        {/* ━━━ Sidebar (laptop and desktop; phones and tablets use the navbar menu) ━━━ */}
        <Show on={["l", "d"]}>
          <Sidebar
            selectedKey={nav}
            onSelect={setNav}
            responsive={false}
            header={
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background"><Zap size={16} /></span>
                <span className="font-semibold text-foreground">Acme Store</span>
              </div>
            }
            footer={
              <Card className="p-3">
                <p className="text-sm font-medium text-foreground">{t({ en: "Go Pro", uz: "Pro'ga o'ting", ru: "Перейти на Pro" })}</p>
                <p className="mt-0.5 text-xs text-muted">{t({ en: "AI assistant and unlimited orders", uz: "AI yordamchi va cheksiz buyurtmalar", ru: "AI-ассистент и безлимитные заказы" })}</p>
                <Button size="sm" fullWidth className="mt-3" onClick={() => setUpgradeOpen(true)}>{t({ en: "Upgrade", uz: "Yangilash", ru: "Обновить" })}</Button>
              </Card>
            }
          >
            <SidebarSection title={t({ en: "Main", uz: "Asosiy", ru: "Основное" })}>
              {navItems.map((n) => (
                <SidebarItem
                  key={n.key}
                  itemKey={n.key}
                  icon={n.icon}
                  title={n.title}
                  endContent={n.key === "orders" ? <Chip size="sm" color="accent">8</Chip> : undefined}
                />
              ))}
            </SidebarSection>
            <SidebarSection title={t({ en: "Workspace", uz: "Ish joyi", ru: "Рабочее место" })}>
              <SidebarItem itemKey="messages" icon={<MessageSquare size={18} />} title={t({ en: "Messages", uz: "Xabarlar", ru: "Сообщения" })} endContent={<Chip size="sm" color="danger" variant="primary">3</Chip>} />
              <SidebarItem itemKey="files" icon={<FolderOpen size={18} />} title={t({ en: "Files", uz: "Fayllar", ru: "Файлы" })} />
              <SidebarItem itemKey="docs" icon={<BookOpen size={18} />} title={t({ en: "Docs", uz: "Hujjatlar", ru: "Документация" })} href="/" />
              <SidebarItem itemKey="settings" icon={<Settings size={18} />} title={t({ en: "Settings", uz: "Sozlamalar", ru: "Настройки" })} />
            </SidebarSection>
          </Sidebar>
        </Show>

        {/* ━━━ Main ━━━ */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <Navbar position="sticky" isBlurred isBordered maxWidth="full" responsive={["m", "t"]}>
            <NavbarContent justify="start" isAlwaysVisible className="gap-2">
              <NavbarMenuToggle srOnlyText={t({ en: "Menu", uz: "Menyu", ru: "Меню" })} />
              <NavbarBrand>
                <div>
                  <p className="text-base font-semibold text-foreground">{t({ en: "Dashboard", uz: "Dashboard", ru: "Дашборд" })}</p>
                  <Hide on="m">
                    <p className="text-xs text-muted">{formatToday(lang)}</p>
                  </Hide>
                </div>
              </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end" isAlwaysVisible>
              <Show on={["l", "d"]}>
                <NavbarItem className="w-64">
                  <Input
                    size="sm"
                    radius="full"
                    placeholder={t({ en: "Search...", uz: "Qidirish...", ru: "Поиск..." })}
                    startContent={<Search size={15} />}
                    endContent={<Kbd keys="ctrl">K</Kbd>}
                    responsive={false}
                    aria-label={t({ en: "Search", uz: "Qidirish", ru: "Поиск" })}
                  />
                </NavbarItem>
              </Show>
              <Hide on="m">
                <NavbarItem>
                  <Tooltip content={densityLabel}>
                    <div>{densitySwitch}</div>
                  </Tooltip>
                </NavbarItem>
              </Hide>
              <NavbarItem><Notifications /></NavbarItem>
              <Hide on="m">
                <NavbarItem><LanguageSwitch lang={lang} onChange={setLang} /></NavbarItem>
              </Hide>
              <NavbarItem><ThemeButton /></NavbarItem>
              <NavbarItem><UserMenu /></NavbarItem>
            </NavbarContent>
            <NavbarMenu>
              {navItems.map((n, i) => (
                <NavbarMenuItem key={n.key} index={i} isActive={nav === n.key} onClick={() => setNav(n.key)}>
                  <span className="flex items-center gap-3">{n.icon}{n.title}</span>
                </NavbarMenuItem>
              ))}
              <Show on="m">
                <div className="flex items-center gap-3 pt-3">
                  <LanguageSwitch lang={lang} onChange={setLang} />
                  {densitySwitch}
                </div>
              </Show>
            </NavbarMenu>
          </Navbar>

          <Container as="main" size="2xl" paddingY={density === "sm" ? "md" : "lg"}>
            <Stack gap={z.gap}>
              {/* Header row: stacks on phones */}
              <Stack direction="row" justify="between" align="end" gap="md" wrap className="mobile:items-start">
                <div>
                  <h1 className={`${density === "sm" ? "text-xl" : density === "lg" ? "text-3xl" : "text-2xl"} font-semibold tracking-tight text-foreground`}>{t({ en: "Welcome back, Rafiqjon 👋", uz: "Xush kelibsiz, Rafiqjon 👋", ru: "С возвращением, Рафикжон 👋" })}</h1>
                  <p className="mt-1 text-sm text-muted">{t({ en: "Here's how your store is doing today", uz: "Do'koningizning bugungi holati", ru: "Состояние вашего магазина сегодня" })}</p>
                </div>
                <Stack direction="row" gap="sm" responsive={false}>
                  <Tooltip content={t({ en: "Refresh", uz: "Yangilash", ru: "Обновить" })}>
                    <Button isIconOnly size={z.button} variant="tertiary" onClick={refresh} aria-label={t({ en: "Refresh", uz: "Yangilash", ru: "Обновить" })}>
                      {loading ? <Spinner size="sm" color="current" /> : <RefreshCw size={16} />}
                    </Button>
                  </Tooltip>
                  <Button size={z.button} variant="tertiary" startContent={<Download size={16} />}>{t({ en: "Export", uz: "Eksport", ru: "Экспорт" })}</Button>
                  <Button size={z.button} startContent={<Plus size={16} />} onClick={() => setOrderOpen(true)}>{t({ en: "New order", uz: "Yangi buyurtma", ru: "Новый заказ" })}</Button>
                </Stack>
              </Stack>

              {showAlert && (
                <Alert
                  color="accent"
                  variant="soft"
                  title={t({ en: "14-day free Pro trial", uz: "Pro tarifning 14 kunlik bepul sinovi", ru: "14 дней Pro бесплатно" })}
                  description={t({ en: "Try the AI assistant, advanced analytics and unlimited orders.", uz: "AI yordamchi, kengaytirilgan analitika va cheksiz buyurtmalarni sinab ko'ring.", ru: "Попробуйте AI-ассистента, расширенную аналитику и безлимитные заказы." })}
                  action={<Button size={z.small} onClick={() => setUpgradeOpen(true)}>{t({ en: "Try it", uz: "Sinab ko'rish", ru: "Попробовать" })}</Button>}
                  onClose={() => setShowAlert(false)}
                />
              )}

              {/* KPI: 1 column on phones, 2 on tablets, 4 from laptop up */}
              <Grid cols={4} gap={z.gap}>
                {[
                  { title: t({ en: "Revenue", uz: "Daromad", ru: "Выручка" }), value: "$48,230", change: 12.5, color: "accent" as const, icon: <DollarSign size={16} />, chart: [22, 28, 25, 31, 36, 33, 40, 44] },
                  { title: t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" }), value: "1,284", change: 8.2, color: "success" as const, icon: <ShoppingBag size={16} />, chart: [12, 15, 14, 18, 17, 21, 24, 23] },
                  { title: t({ en: "New customers", uz: "Yangi mijozlar", ru: "Новые клиенты" }), value: "342", change: -3.1, color: "warning" as const, icon: <Users size={16} />, chart: [30, 28, 31, 27, 26, 25, 27, 24] },
                  { title: t({ en: "Conversion", uz: "Konversiya", ru: "Конверсия" }), value: "3.8%", change: 1.7, color: "danger" as const, icon: <TrendingUp size={16} />, progress: 64 },
                ].map((k) => (
                  <Skeleton key={k.title} isLoaded={!loading} className={density === "sm" ? "rounded-2xl" : "rounded-3xl"}>
                    <StatCard
                      size={z.stat}
                      title={k.title}
                      value={k.value}
                      change={k.change}
                      color={k.color}
                      icon={k.icon}
                      chartData={k.chart}
                      progress={k.progress}
                      actions={<CardMenu />}
                      className="h-full"
                    />
                  </Skeleton>
                ))}
              </Grid>

              {/* Revenue trend + sales channels */}
              <Grid cols={3} gap={z.gap}>
                <GridItem span={2}>
                  <Card size={z.card} className="h-full">
                    <CardHeader
                      title={t({ en: "Revenue trend", uz: "Daromad dinamikasi", ru: "Динамика выручки" })}
                      description={
                        <span className="flex items-center gap-2">
                          {money(windowTotal)}
                          <Chip size={z.chip} color="success" startContent={<ArrowUpRight size={12} />}>+{growth}%</Chip>
                        </span>
                      }
                      endContent={
                        <Tabs
                          size={z.tabs}
                          selectedKey={range}
                          onSelectionChange={setRange}
                          tabs={[
                            { key: "week", title: t({ en: "7 days", uz: "7 kun", ru: "7 дней" }) },
                            { key: "month", title: t({ en: "30 days", uz: "30 kun", ru: "30 дней" }) },
                            { key: "quarter", title: t({ en: "90 days", uz: "90 kun", ru: "90 дней" }) },
                          ]}
                        />
                      }
                    />
                    <CardBody className="pb-4">
                      <Skeleton isLoaded={!loading} className="rounded-2xl">
                        <LineChart
                          key={range}
                          aria-label={t({ en: "Revenue per day, this period and the previous one", uz: "Kunlik daromad: joriy va oldingi davr", ru: "Выручка по дням: текущий и предыдущий период" })}
                          data={DAILY}
                          xKey="date"
                          series={[
                            { key: "revenue", label: t({ en: "This period", uz: "Joriy davr", ru: "Текущий период" }) },
                            { key: "previous", label: t({ en: "Previous period", uz: "Oldingi davr", ru: "Предыдущий период" }), color: "indigo" },
                          ]}
                          showArea
                          showRangeSelector
                          defaultRange={RANGES[range]}
                          height={z.lineH}
                          valueFormatter={money}
                          xFormatter={(d) => formatDay(isoDay(d as Date), lang)}
                        />
                      </Skeleton>
                    </CardBody>
                  </Card>
                </GridItem>

                <Card size={z.card}>
                  <CardHeader title={t({ en: "Sales channels", uz: "Savdo kanallari", ru: "Каналы продаж" })} description={t({ en: "Last 30 days", uz: "So'nggi 30 kun", ru: "За 30 дней" })} endContent={<CardMenu />} />
                  <CardBody className="pb-5">
                    <PieChart
                      aria-label={t({ en: "Revenue by sales channel", uz: "Savdo kanallari bo'yicha daromad", ru: "Выручка по каналам продаж" })}
                      variant="donut"
                      size={z.pie}
                      data={CHANNELS.map((c, i) => ({ key: c.key, label: t(c.label), value: c.value, color: (["blue", "green", "orange"] as const)[i] }))}
                      valueFormatter={money}
                      centerLabel={t({ en: "revenue", uz: "daromad", ru: "выручка" })}
                    />
                  </CardBody>
                </Card>
              </Grid>

              {/* Orders by weekday · categories · monthly goals */}
              <Grid cols={3} gap={z.gap}>
                <Card size={z.card}>
                  <CardHeader title={t({ en: "Orders by weekday", uz: "Hafta kunlari bo'yicha", ru: "Заказы по дням недели" })} description={t({ en: "This week", uz: "Shu hafta", ru: "Эта неделя" })} />
                  <CardBody className="pb-4">
                    <BarChart
                      aria-label={t({ en: "Orders per weekday by status", uz: "Hafta kunlari bo'yicha buyurtmalar", ru: "Заказы по дням недели и статусам" })}
                      data={WEEK_ORDERS.map((w, i) => ({ day: t(WEEKDAYS[i]), ...w }))}
                      xKey="day"
                      isStacked
                      height={z.barH}
                      series={[
                        { key: "paid", label: t(STATUS.paid.label), color: "green" },
                        { key: "shipped", label: t(STATUS.shipped.label), color: "blue" },
                        { key: "cancelled", label: t(STATUS.cancelled.label), color: "pink" },
                      ]}
                    />
                  </CardBody>
                </Card>

                <Card size={z.card}>
                  <CardHeader title={t({ en: "Top categories", uz: "Eng yaxshi kategoriyalar", ru: "Лучшие категории" })} description={t({ en: "Revenue, last 30 days", uz: "Daromad, so'nggi 30 kun", ru: "Выручка за 30 дней" })} />
                  <CardBody className="pb-4">
                    <BarChart
                      aria-label={t({ en: "Revenue by category", uz: "Kategoriyalar bo'yicha daromad", ru: "Выручка по категориям" })}
                      layout="horizontal"
                      data={CATEGORIES.map((c) => ({ name: t(c.label), value: c.value }))}
                      xKey="name"
                      series={[{ key: "value", label: t({ en: "Revenue", uz: "Daromad", ru: "Выручка" }), color: "purple" }]}
                      valueFormatter={money}
                      showValues
                      showGrid={false}
                    />
                  </CardBody>
                </Card>

                <Card size={z.card}>
                  <CardHeader title={t({ en: "Monthly goals", uz: "Oylik maqsadlar", ru: "Цели на месяц" })} description={t({ en: "October 2026", uz: "Oktyabr, 2026", ru: "Октябрь 2026" })} endContent={<CardMenu />} />
                  <CardBody className="pb-5">
                    <PieChart
                      aria-label={t({ en: "Monthly goals, percent done", uz: "Oylik maqsadlar, bajarilgan foiz", ru: "Цели на месяц, процент выполнения" })}
                      variant="radial"
                      size={z.radial}
                      maxValue={100}
                      data={GOALS.map((g, i) => ({ key: g.key, label: t(g.label), value: g.value, color: (["blue", "green", "amber"] as const)[i] }))}
                      valueFormatter={(v) => `${v}%`}
                      centerValue="67%"
                      centerLabel={t({ en: "average", uz: "o'rtacha", ru: "в среднем" })}
                    />
                  </CardBody>
                </Card>
              </Grid>

              {/* Orders table */}
              <Card size={z.card}>
                <CardHeader
                  title={t({ en: "Recent orders", uz: "So'nggi buyurtmalar", ru: "Последние заказы" })}
                  description={t({ en: `${filtered.length} orders${selected.size ? ` · ${selected.size} selected` : ""}`, uz: `${filtered.length} ta buyurtma${selected.size ? ` · ${selected.size} ta tanlangan` : ""}`, ru: `Заказов: ${filtered.length}${selected.size ? ` · выбрано ${selected.size}` : ""}` })}
                  endContent={
                    <ButtonGroup size={z.small} variant="tertiary" responsive={false}>
                      <Button startContent={<Download size={14} />}>CSV</Button>
                      <Button isDisabled={!selected.size} startContent={<Trash2 size={14} />} onClick={() => { addToast({ title: t({ en: `${selected.size} orders deleted`, uz: `${selected.size} ta buyurtma o'chirildi`, ru: `Удалено заказов: ${selected.size}` }), color: "danger" }); setSelected(new Set()); }}>{t({ en: "Delete", uz: "O'chirish", ru: "Удалить" })}</Button>
                    </ButtonGroup>
                  }
                />
                <CardBody>
                  <Table<Order>
                    aria-label={t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" })}
                    variant="secondary"
                    isCompact={density === "sm"}
                    keyField="id"
                    rows={rows}
                    selectionMode="multiple"
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                    isLoading={loading}
                    topContent={
                      <Stack direction="row" gap="sm" align="center">
                        <Input
                          size={z.field === "lg" ? "md" : "sm"}
                          variant="secondary"
                          placeholder={t({ en: "Customer, ID or product...", uz: "Mijoz, ID yoki mahsulot...", ru: "Клиент, ID или товар..." })}
                          startContent={<Search size={14} />}
                          value={query}
                          onValueChange={(v) => { setQuery(v); setPage(1); }}
                          isClearable
                          onClear={() => setQuery("")}
                          className="max-w-xs"
                          aria-label={t({ en: "Search", uz: "Qidirish", ru: "Поиск" })}
                        />
                        <div className="w-full sm:w-48">
                          <Select
                            size={z.field === "lg" ? "md" : "sm"}
                            variant="secondary"
                            aria-label={t({ en: "Status", uz: "Holat", ru: "Статус" })}
                            selectedKey={status}
                            onSelectionChange={(k) => { setStatus(k); setPage(1); }}
                            items={[
                              { key: "all", label: t({ en: "All statuses", uz: "Barcha holatlar", ru: "Все статусы" }) },
                              ...Object.entries(STATUS).map(([key, st]) => ({ key, label: t(st.label) })),
                            ]}
                          />
                        </div>
                      </Stack>
                    }
                    emptyContent={<div className="py-10 text-center text-sm text-muted">{t({ en: "Nothing found", uz: "Hech narsa topilmadi", ru: "Ничего не найдено" })}</div>}
                    bottomContent={
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted">{t({ en: "Page", uz: "Sahifa", ru: "Страница" })} {page} / {pages}</p>
                        <Pagination total={pages} page={page} onChange={setPage} size={z.small} />
                      </div>
                    }
                    columns={[
                      { key: "id", label: "ID", render: (v) => <span className="font-mono text-xs text-muted">{String(v)}</span> },
                      {
                        key: "customer",
                        label: t({ en: "Customer", uz: "Mijoz", ru: "Клиент" }),
                        sortable: true,
                        render: (_v, r) => (
                          <div className="flex items-center gap-3">
                            <Avatar src={avatarUrl(r.email)} name={r.customer} size={z.avatar} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{r.customer}</p>
                              <p className="truncate text-xs text-muted">{r.email}</p>
                            </div>
                          </div>
                        ),
                      },
                      { key: "product", label: t({ en: "Product", uz: "Mahsulot", ru: "Товар" }) },
                      { key: "amount", label: t({ en: "Amount", uz: "Summa", ru: "Сумма" }), sortable: true, align: "end", render: (v) => <span className="tabular-nums">${Number(v).toLocaleString("en-US")}</span> },
                      { key: "status", label: t({ en: "Status", uz: "Holat", ru: "Статус" }), render: (v) => <Chip size={z.chip} dot color={STATUS[v as Status].color}>{t(STATUS[v as Status].label)}</Chip> },
                      { key: "date", label: t({ en: "Date", uz: "Sana", ru: "Дата" }), render: (v) => <span className="text-muted">{formatDay(String(v), lang)}</span> },
                      {
                        key: "actions",
                        label: "",
                        align: "end",
                        render: (_v, r) => (
                          <div className="flex justify-end gap-0.5">
                            <Tooltip content={t({ en: "View", uz: "Ko'rish", ru: "Просмотр" })}><Button isIconOnly size="sm" variant="ghost" responsive={false} aria-label={t({ en: "View", uz: "Ko'rish", ru: "Просмотр" })}><Eye size={15} /></Button></Tooltip>
                            <Tooltip content={t({ en: "Edit", uz: "Tahrirlash", ru: "Изменить" })}><Button isIconOnly size="sm" variant="ghost" responsive={false} aria-label={t({ en: "Edit", uz: "Tahrirlash", ru: "Изменить" })}><Pencil size={15} /></Button></Tooltip>
                            <Tooltip content={t({ en: "Ship", uz: "Jo'natish", ru: "Отправить" })}><Button isIconOnly size="sm" variant="ghost" responsive={false} aria-label={t({ en: "Ship", uz: "Jo'natish", ru: "Отправить" })} onClick={() => addToast({ title: t({ en: `${r.id} shipped`, uz: `${r.id} jo'natildi`, ru: `${r.id} отправлен` }), icon: <Truck size={16} />, color: "accent" })}><Truck size={15} /></Button></Tooltip>
                          </div>
                        ),
                      },
                    ]}
                  />
                </CardBody>
              </Card>

              {/* Activity · Team · AI */}
              <Grid cols={3} gap={z.gap}>
                <Card size={z.card}>
                  <CardHeader title={t({ en: "Activity", uz: "Faollik", ru: "Активность" })} description={t({ en: "Last 24 hours", uz: "So'nggi 24 soat", ru: "За последние 24 часа" })} endContent={<Activity size={16} className="text-muted" />} />
                  <CardBody>
                    <Timeline
                      items={[
                        { id: "a1", title: t({ en: <><b className="font-medium">Dilnoza</b> shipped #3209</>, uz: <><b className="font-medium">Dilnoza</b> #3209 ni jo'natdi</>, ru: <><b className="font-medium">Дильноза</b> отправила #3209</> }), time: t({ en: "10 min", uz: "10 daq", ru: "10 мин" }), color: "accent", icon: <Truck size={14} /> },
                        { id: "a2", title: t({ en: "Payment received", uz: "To'lov qabul qilindi", ru: "Платёж получен" }), description: "Click · $599", time: t({ en: "1 h", uz: "1 soat", ru: "1 ч" }), color: "success", icon: <DollarSign size={14} /> },
                        { id: "a3", title: t({ en: <><b className="font-medium">Jasur</b> added a product</>, uz: <><b className="font-medium">Jasur</b> mahsulot qo'shdi</>, ru: <><b className="font-medium">Жасур</b> добавил товар</> }), time: t({ en: "3 h", uz: "3 soat", ru: "3 ч" }), icon: <Package size={14} />, content: <div className="rounded-xl bg-surface-secondary px-3 py-2 text-xs text-muted">27" 5K display · {t({ en: "12 pcs", uz: "12 dona", ru: "12 шт." })} · $1,599</div> },
                        { id: "a4", title: t({ en: "Low stock", uz: "Zaxira kam qoldi", ru: "Заканчивается запас" }), description: t({ en: "Wireless earbuds — 4 left", uz: "Wireless earbuds — 4 dona", ru: "Wireless earbuds — 4 шт." }), time: t({ en: "5 h", uz: "5 soat", ru: "5 ч" }), color: "warning", icon: <AlertTriangle size={14} /> },
                      ]}
                    />
                  </CardBody>
                </Card>

                <Card size={z.card}>
                  <CardHeader
                    title={t({ en: "Team", uz: "Jamoa", ru: "Команда" })}
                    description={t({ en: "4 members · 3 online", uz: "4 a'zo · 3 onlayn", ru: "4 участника · 3 онлайн" })}
                    endContent={
                      <AvatarGroup max={3} size={z.avatar}>
                        {TEAM.map((m, i) => <Avatar key={m.name} src={i === 0 ? avatarUrl("rafiqjon") : avatarUrl(m.name)} name={m.name} />)}
                      </AvatarGroup>
                    }
                  />
                  <CardBody className="gap-1">
                    {TEAM.map((m, i) => (
                      <div key={m.name} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-surface-secondary">
                        <Badge isDot color={m.online ? "success" : "default"} placement="bottom-right">
                          <Avatar src={i === 0 ? avatarUrl("rafiqjon") : avatarUrl(m.name)} name={m.name} size={z.avatar} />
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted">{t(m.role)}</p>
                        </div>
                        {i > 0 && <Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "Message", uz: "Xabar", ru: "Сообщение" })}><MessageSquare size={15} /></Button>}
                      </div>
                    ))}
                    <Divider className="my-3" />
                    <div className="flex items-center justify-between px-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t({ en: "Customer rating", uz: "Mijozlar bahosi", ru: "Оценка клиентов" })}</p>
                        <p className="text-xs text-muted">{t({ en: "1,240 reviews", uz: "1,240 ta sharh", ru: "1 240 отзывов" })}</p>
                      </div>
                      <Rating value={4.6} isReadOnly size={z.small} showValue responsive={false} />
                    </div>
                  </CardBody>
                </Card>

                <Card size={z.card} className="flex flex-col">
                  <CardHeader
                    title={<span className="flex items-center gap-2"><Sparkles size={16} className="text-accent" /> {t({ en: "AI assistant", uz: "AI yordamchi", ru: "AI-ассистент" })}</span>}
                    description={t({ en: "Ask about your sales", uz: "Savdo bo'yicha savol bering", ru: "Спросите о продажах" })}
                    endContent={<Chip size={z.chip} color="success" dot>{t({ en: "Online", uz: "Onlayn", ru: "Онлайн" })}</Chip>}
                  />
                  <ChatContainer className={`${z.chat} flex-1 space-y-4 overflow-y-auto px-4`}>
                    {messages.map((m, i) => (
                      <ChatMessage key={i} role={m.role} showActions={m.role === "assistant"}>{typeof m.text === "string" ? m.text : t(m.text)}</ChatMessage>
                    ))}
                    {chatLoading && <ChatMessage role="assistant" isTyping />}
                  </ChatContainer>
                  <div className="p-3">
                    <PromptInput onSubmit={sendChat} isLoading={chatLoading} onStop={() => setChatLoading(false)} minRows={1} suggestions={[t({ en: "Weekly report", uz: "Haftalik hisobot", ru: "Недельный отчёт" }), t({ en: "Top customers", uz: "Eng yaxshi mijozlar", ru: "Лучшие клиенты" })]} />
                  </div>
                </Card>
              </Grid>

              {/* Setup · Store profile (floating labels from the Form) · Notifications */}
              <Grid cols={3} gap={z.gap}>
                <Card size={z.card}>
                  <CardHeader title={t({ en: "Store setup", uz: "Do'konni sozlash", ru: "Настройка магазина" })} description={t({ en: `${step} / 4 steps done`, uz: `${step} / 4 bosqich bajarildi`, ru: `Выполнено шагов: ${step} / 4` })} />
                  <CardBody className={density === "sm" ? "gap-4" : "gap-6"}>
                    <Stepper
                      currentStep={step}
                      onStepChange={setStep}
                      steps={[
                        { title: t({ en: "Profile", uz: "Profil", ru: "Профиль" }) },
                        { title: t({ en: "Products", uz: "Mahsulotlar", ru: "Товары" }) },
                        { title: t({ en: "Payments", uz: "To'lov", ru: "Оплата" }) },
                        { title: t({ en: "Launch", uz: "Ishga tushirish", ru: "Запуск" }) },
                      ]}
                    />
                    <Accordion variant="splitted" defaultExpandedKeys={new Set(["pay"])}>
                      <AccordionItem itemKey="pay" title={t({ en: "Connect payments", uz: "To'lov tizimini ulash", ru: "Подключить оплату" })} subtitle={t({ en: "Next step", uz: "Keyingi qadam", ru: "Следующий шаг" })} startContent={<CreditCard size={18} className="text-accent" />}>
                        <p className="text-sm text-muted">{t({ en: "Enter your Click or Payme keys so customers can pay by card.", uz: "Click yoki Payme kalitlarini kiriting — mijozlar karta orqali to'lay oladi.", ru: "Введите ключи Click или Payme — клиенты смогут платить картой." })}</p>
                        <Button size={z.small} className="mt-3" onClick={() => setStep(Math.min(4, step + 1))}>{t({ en: "Connect", uz: "Ulash", ru: "Подключить" })}</Button>
                      </AccordionItem>
                      <AccordionItem itemKey="ship" title={t({ en: "Delivery zones", uz: "Yetkazib berish zonalari", ru: "Зоны доставки" })} startContent={<Truck size={18} className="text-success" />}>
                        <p className="text-sm text-muted">{t({ en: "Free across Tashkent, from 25,000 UZS to the regions.", uz: "Toshkent bo'ylab bepul, viloyatlarga 25 000 so'mdan.", ru: "Бесплатно по Ташкенту, в регионы — от 25 000 сумов." })}</p>
                      </AccordionItem>
                      <AccordionItem itemKey="team" title={t({ en: "Invite your team", uz: "Jamoani taklif qilish", ru: "Пригласить команду" })} startContent={<Users size={18} className="text-warning" />}>
                        <p className="text-sm text-muted">{t({ en: "Send invites by email and assign roles.", uz: "Email orqali taklif yuboring va rollarni belgilang.", ru: "Отправьте приглашения по email и назначьте роли." })}</p>
                      </AccordionItem>
                    </Accordion>
                  </CardBody>
                </Card>

                <Card size={z.card}>
                  <CardHeader title={t({ en: "Store profile", uz: "Do'kon profili", ru: "Профиль магазина" })} description={t({ en: "Shown on receipts and invoices", uz: "Cheklar va invoyslarda ko'rinadi", ru: "Показывается в чеках и счетах" })} />
                  <CardBody>
                    <Form
                      labelPlacement="floating"
                      variant="primary"
                      size={z.field}
                      isDisabled={saving}
                      onValues={() => {
                        setSaving(true);
                        setTimeout(() => {
                          setSaving(false);
                          addToast({ title: t({ en: "Store profile saved", uz: "Do'kon profili saqlandi", ru: "Профиль магазина сохранён" }), color: "success" });
                        }, 800);
                      }}
                    >
                      <Input name="store" label={t({ en: "Store name", uz: "Do'kon nomi", ru: "Название магазина" })} defaultValue="Acme Store" isRequired />
                      <Input name="owner" label={t({ en: "Owner", uz: "Egasi", ru: "Владелец" })} defaultValue="Rafiqjon Nazirov" />
                      <PhoneInput name="phone" label={t({ en: "Phone", uz: "Telefon", ru: "Телефон" })} country="UZ" />
                      <Select
                        name="currency"
                        label={t({ en: "Currency", uz: "Valyuta", ru: "Валюта" })}
                        defaultSelectedKey="uzs"
                        items={[
                          { key: "uzs", label: "UZS — so'm" },
                          { key: "usd", label: "USD — $" },
                        ]}
                      />
                      <Textarea name="address" label={t({ en: "Address", uz: "Manzil", ru: "Адрес" })} defaultValue={t({ en: "Tashkent, Olmazor district", uz: "Toshkent, Olmazor tumani", ru: "Ташкент, Алмазарский район" })} minRows={2} />
                      <Button type="submit" size={z.button} isLoading={saving} className="self-end">{t({ en: "Save", uz: "Saqlash", ru: "Сохранить" })}</Button>
                    </Form>
                  </CardBody>
                </Card>

                <Card size={z.card}>
                  <CardHeader title={t({ en: "Notifications", uz: "Bildirishnomalar", ru: "Уведомления" })} description={t({ en: "Choose what you want to receive", uz: "Qaysi xabarlarni olishni tanlang", ru: "Выберите, какие уведомления получать" })} />
                  <CardBody className={density === "sm" ? "gap-3" : "gap-5"}>
                    <div className="divide-y divide-separator rounded-2xl bg-surface-secondary px-4">
                      {[
                        { label: t({ en: "New orders", uz: "Yangi buyurtmalar", ru: "Новые заказы" }), desc: t({ en: "Instantly for every order", uz: "Har bir buyurtma haqida darhol", ru: "Сразу о каждом заказе" }), on: true },
                        { label: t({ en: "Daily report", uz: "Kunlik hisobot", ru: "Ежедневный отчёт" }), desc: t({ en: "Email every day at 09:00", uz: "Har kuni 09:00 da email", ru: "Email каждый день в 09:00" }), on: true },
                        { label: t({ en: "Marketing", uz: "Marketing xabarlari", ru: "Маркетинг" }), desc: t({ en: "News and offers", uz: "Yangiliklar va takliflar", ru: "Новости и предложения" }), on: false },
                      ].map((n) => (
                        <div key={n.label} className={`flex items-center justify-between gap-4 ${density === "sm" ? "py-2.5" : "py-3.5"}`}>
                          <div>
                            <p className="text-sm font-medium text-foreground">{n.label}</p>
                            <p className="text-xs text-muted">{n.desc}</p>
                          </div>
                          <Switch size={z.small} defaultSelected={n.on} aria-label={n.label} />
                        </div>
                      ))}
                    </div>
                    <CheckboxGroup label={t({ en: "Channels", uz: "Kanallar", ru: "Каналы" })} orientation="horizontal" defaultValue={["email", "bot"]} variant="secondary" size={z.small}>
                      <Checkbox value="email">Email</Checkbox>
                      <Checkbox value="sms">SMS</Checkbox>
                      <Checkbox value="bot">{t({ en: "Chat bot", uz: "Chat-bot", ru: "Чат-бот" })}</Checkbox>
                      <Checkbox value="push">Push</Checkbox>
                    </CheckboxGroup>
                  </CardBody>
                </Card>
              </Grid>

              <p className="pb-4 text-center text-xs text-muted">
                {t({ en: "This page is built entirely with", uz: "Bu sahifa to'liq", ru: "Эта страница целиком собрана из" })} <code className="font-mono">nr-ui-kit</code> {t({ en: "components", uz: "komponentlari bilan qurilgan", ru: "компонентов" })} · <a href="/" className="text-accent hover:underline">{t({ en: "Docs", uz: "Hujjatlar", ru: "Документация" })}</a>
              </p>
            </Stack>
          </Container>
        </div>

        <NewOrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
        <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      </div>
    </ResponsiveProvider>
  );
}
