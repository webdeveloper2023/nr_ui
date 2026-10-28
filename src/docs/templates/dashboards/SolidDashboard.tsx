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
import { STATUS, ORDERS, REVENUE, TEAM, PAGE_SIZE, avatarUrl, formatDay, formatToday, type Order, type Status } from "./data";
import { useLang, useT, type Tr } from "../../i18n/lang";
import { LanguageSwitch } from "../../LanguageSwitch";
import { useDesignStyle } from "../../designStyle";
import { DesignStyleSwitch } from "../../DesignStyleSwitch";

// ─── Page ───────────────────────────────────
export default function SolidDashboard() {
  const [designStyle, setDesignStyle] = useDesignStyle();
  const [lang, setLang] = useLang();
  const t = useT();
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
            <p className="text-sm font-medium text-foreground">{t({ en: "Go Pro", uz: "Pro'ga o'ting", ru: "Перейти на Pro" })}</p>
            <p className="mt-0.5 text-xs text-muted">{t({ en: "AI assistant and unlimited orders", uz: "AI yordamchi va cheksiz buyurtmalar", ru: "AI-ассистент и безлимитные заказы" })}</p>
            <Progress value={72} size="sm" className="mt-3" label={t({ en: "Limit", uz: "Limit", ru: "Лимит" })} showValueLabel />
            <Button size="sm" fullWidth className="mt-3" onClick={() => setUpgradeOpen(true)}>{t({ en: "Upgrade", uz: "Yangilash", ru: "Обновить" })}</Button>
          </Card>
        }
      >
        <SidebarSection title={t({ en: "Main", uz: "Asosiy", ru: "Основное" })}>
          <SidebarItem itemKey="dashboard" icon={<LayoutDashboard size={18} />} title={t({ en: "Dashboard", uz: "Dashboard", ru: "Дашборд" })} />
          <SidebarItem itemKey="orders" icon={<ShoppingBag size={18} />} title={t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" })} endContent={<Chip size="sm" color="accent">8</Chip>}>
            <SidebarItem itemKey="orders-all" title={t({ en: "All", uz: "Barchasi", ru: "Все" })} />
            <SidebarItem itemKey="orders-pending" title={t({ en: "Pending", uz: "Kutilmoqda", ru: "В ожидании" })} />
            <SidebarItem itemKey="orders-shipped" title={t({ en: "Shipped", uz: "Yo'lda", ru: "В пути" })} />
          </SidebarItem>
          <SidebarItem itemKey="products" icon={<Package size={18} />} title={t({ en: "Products", uz: "Mahsulotlar", ru: "Товары" })} />
          <SidebarItem itemKey="customers" icon={<Users size={18} />} title={t({ en: "Customers", uz: "Mijozlar", ru: "Клиенты" })} />
          <SidebarItem itemKey="analytics" icon={<BarChart3 size={18} />} title={t({ en: "Analytics", uz: "Analitika", ru: "Аналитика" })} />
        </SidebarSection>
        <SidebarSection title={t({ en: "Workspace", uz: "Ish joyi", ru: "Рабочее место" })}>
          <SidebarItem itemKey="messages" icon={<MessageSquare size={18} />} title={t({ en: "Messages", uz: "Xabarlar", ru: "Сообщения" })} endContent={<Chip size="sm" color="danger" variant="primary">3</Chip>} />
          <SidebarItem itemKey="files" icon={<FolderOpen size={18} />} title={t({ en: "Files", uz: "Fayllar", ru: "Файлы" })} />
          <SidebarItem itemKey="docs" icon={<BookOpen size={18} />} title={t({ en: "Docs", uz: "Hujjatlar", ru: "Документация" })} href="/" />
          <SidebarItem itemKey="settings" icon={<Settings size={18} />} title={t({ en: "Settings", uz: "Sozlamalar", ru: "Настройки" })} />
        </SidebarSection>
      </Sidebar>

      {/* ━━━ Main ━━━ */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <Navbar position="sticky" isBlurred isBordered maxWidth="full">
          <NavbarBrand>
            <div>
              <p className="text-base font-semibold text-foreground">{t({ en: "Dashboard", uz: "Dashboard", ru: "Дашборд" })}</p>
              <p className="hidden sm:block text-xs text-muted">{formatToday(lang)}</p>
            </div>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem className="hidden md:flex">
              <Input
                size="sm"
                radius="full"
                placeholder={t({ en: "Search...", uz: "Qidirish...", ru: "Поиск..." })}
                startContent={<Search size={15} />}
                endContent={<Kbd keys="ctrl">K</Kbd>}
                className="w-64"
                aria-label={t({ en: "Search", uz: "Qidirish", ru: "Поиск" })}
              />
            </NavbarItem>
            <NavbarItem><Notifications /></NavbarItem>
            <NavbarItem><DesignStyleSwitch style={designStyle} onChange={setDesignStyle} /></NavbarItem>
            <NavbarItem className="hidden sm:flex"><LanguageSwitch lang={lang} onChange={setLang} /></NavbarItem>
            <NavbarItem><ThemeButton /></NavbarItem>
            <NavbarItem><UserMenu /></NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t({ en: "Welcome back, Rafiqjon 👋", uz: "Xush kelibsiz, Rafiqjon 👋", ru: "С возвращением, Рафикжон 👋" })}</h1>
              <p className="mt-1 text-sm text-muted">{t({ en: "Here's how your store is doing today", uz: "Do'koningizning bugungi holati", ru: "Состояние вашего магазина сегодня" })}</p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content={t({ en: "Refresh", uz: "Yangilash", ru: "Обновить" })}>
                <Button isIconOnly variant="tertiary" onClick={refresh} aria-label={t({ en: "Refresh", uz: "Yangilash", ru: "Обновить" })}>
                  {loading ? <Spinner size="sm" color="current" /> : <RefreshCw size={16} />}
                </Button>
              </Tooltip>
              <Button variant="tertiary" startContent={<Download size={16} />}>{t({ en: "Export", uz: "Eksport", ru: "Экспорт" })}</Button>
              <Button startContent={<Plus size={16} />} onClick={() => setOrderOpen(true)}>{t({ en: "New order", uz: "Yangi buyurtma", ru: "Новый заказ" })}</Button>
            </div>
          </div>

          {showAlert && (
            <Alert
              color="accent"
              variant="soft"
              title={t({ en: "14-day free Pro trial", uz: "Pro tarifning 14 kunlik bepul sinovi", ru: "14 дней Pro бесплатно" })}
              description={t({ en: "Try the AI assistant, advanced analytics and unlimited orders.", uz: "AI yordamchi, kengaytirilgan analitika va cheksiz buyurtmalarni sinab ko'ring.", ru: "Попробуйте AI-ассистента, расширенную аналитику и безлимитные заказы." })}
              action={<Button size="sm" onClick={() => setUpgradeOpen(true)}>{t({ en: "Try it", uz: "Sinab ko'rish", ru: "Попробовать" })}</Button>}
              onClose={() => setShowAlert(false)}
            />
          )}

          {/* KPI */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: t({ en: "Revenue", uz: "Daromad", ru: "Выручка" }), value: "$48,230", change: 12.5, color: "accent" as const, icon: <DollarSign size={16} />, chart: [22, 28, 25, 31, 36, 33, 40, 44] },
              { title: t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" }), value: "1,284", change: 8.2, color: "success" as const, icon: <ShoppingBag size={16} />, chart: [12, 15, 14, 18, 17, 21, 24, 23] },
              { title: t({ en: "New customers", uz: "Yangi mijozlar", ru: "Новые клиенты" }), value: "342", change: -3.1, color: "warning" as const, icon: <Users size={16} />, chart: [30, 28, 31, 27, 26, 25, 27, 24] },
              { title: t({ en: "Conversion", uz: "Konversiya", ru: "Конверсия" }), value: "3.8%", change: 1.7, color: "danger" as const, icon: <TrendingUp size={16} />, progress: 64 },
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
                title={t({ en: "Revenue trend", uz: "Daromad dinamikasi", ru: "Динамика выручки" })}
                description={<span className="flex items-center gap-2">{revenue.total} <Chip size="sm" color="success" startContent={<ArrowUpRight size={12} />}>{revenue.change}</Chip></span>}
                endContent={
                  <Tabs
                    size="sm"
                    selectedKey={range}
                    onSelectionChange={setRange}
                    tabs={[
                      { key: "week", title: t({ en: "7 days", uz: "7 kun", ru: "7 дней" }) },
                      { key: "month", title: t({ en: "30 days", uz: "30 kun", ru: "30 дней" }) },
                      { key: "year", title: t({ en: "12 months", uz: "12 oy", ru: "12 месяцев" }) },
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
                  { label: t({ en: "Online", uz: "Onlayn", ru: "Онлайн" }), value: "$31,420", color: "bg-accent" },
                  { label: t({ en: "In-store", uz: "Do'kon", ru: "Магазин" }), value: "$12,610", color: "bg-success" },
                  { label: t({ en: "Wholesale", uz: "Ulgurji", ru: "Опт" }), value: "$4,200", color: "bg-warning" },
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
              <CardHeader title={t({ en: "Monthly goals", uz: "Oylik maqsadlar", ru: "Цели на месяц" })} description={t({ en: "October 2026", uz: "Oktyabr, 2026", ru: "Октябрь 2026" })} endContent={<CardMenu />} />
              <CardBody className="space-y-5">
                <div className="flex items-center gap-4 rounded-2xl bg-surface-secondary p-4">
                  <CircularProgress value={78} size="lg" color="accent" showValueLabel />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t({ en: "Sales target", uz: "Sotuv rejasi", ru: "План продаж" })}</p>
                    <p className="text-xs text-muted">$48.2k / $62k</p>
                  </div>
                </div>
                <Progress label={t({ en: "New customers", uz: "Yangi mijozlar", ru: "Новые клиенты" })} value={342} maxValue={500} showValueLabel color="success" />
                <Progress label={t({ en: "Returns", uz: "Qaytarishlar", ru: "Возвраты" })} value={18} maxValue={100} showValueLabel color="danger" />
                <Progress label={t({ en: "Restocking", uz: "Ombor to'ldirish", ru: "Пополнение склада" })} value={55} showValueLabel color="warning" />
              </CardBody>
            </Card>
          </div>

          {/* Orders table */}
          <Card>
            <CardHeader
              title={t({ en: "Recent orders", uz: "So'nggi buyurtmalar", ru: "Последние заказы" })}
              description={t({ en: `${filtered.length} orders${selected.size ? ` · ${selected.size} selected` : ""}`, uz: `${filtered.length} ta buyurtma${selected.size ? ` · ${selected.size} ta tanlangan` : ""}`, ru: `Заказов: ${filtered.length}${selected.size ? ` · выбрано ${selected.size}` : ""}` })}
              endContent={
                <ButtonGroup size="sm" variant="tertiary">
                  <Button startContent={<Download size={14} />}>CSV</Button>
                  <Button isDisabled={!selected.size} startContent={<Trash2 size={14} />} onClick={() => { addToast({ title: t({ en: `${selected.size} orders deleted`, uz: `${selected.size} ta buyurtma o'chirildi`, ru: `Удалено заказов: ${selected.size}` }), color: "danger" }); setSelected(new Set()); }}>{t({ en: "Delete", uz: "O'chirish", ru: "Удалить" })}</Button>
                </ButtonGroup>
              }
            />
            <CardBody>
              <Table<Order>
                aria-label={t({ en: "Orders", uz: "Buyurtmalar", ru: "Заказы" })}
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
                      placeholder={t({ en: "Customer, ID or product...", uz: "Mijoz, ID yoki mahsulot...", ru: "Клиент, ID или товар..." })}
                      startContent={<Search size={14} />}
                      value={query}
                      onValueChange={(v) => { setQuery(v); setPage(1); }}
                      isClearable
                      onClear={() => setQuery("")}
                      className="w-full max-w-xs"
                      aria-label={t({ en: "Search", uz: "Qidirish", ru: "Поиск" })}
                    />
                    <div className="w-48">
                      <Select
                        size="sm"
                        variant="secondary"
                        aria-label={t({ en: "Status", uz: "Holat", ru: "Статус" })}
                        selectedKey={status}
                        onSelectionChange={(k) => { setStatus(k); setPage(1); }}
                        items={[
                          { key: "all", label: t({ en: "All statuses", uz: "Barcha holatlar", ru: "Все статусы" }) },
                          ...Object.entries(STATUS).map(([key, s]) => ({ key, label: t(s.label) })),
                        ]}
                      />
                    </div>
                  </div>
                }
                emptyContent={<div className="py-10 text-center text-sm text-muted">{t({ en: "Nothing found", uz: "Hech narsa topilmadi", ru: "Ничего не найдено" })}</div>}
                bottomContent={
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{t({ en: "Page", uz: "Sahifa", ru: "Страница" })} {page} / {pages}</p>
                    <Pagination total={pages} page={page} onChange={setPage} size="sm" />
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
                        <Avatar src={avatarUrl(r.email)} name={r.customer} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{r.customer}</p>
                          <p className="truncate text-xs text-muted">{r.email}</p>
                        </div>
                      </div>
                    ),
                  },
                  { key: "product", label: t({ en: "Product", uz: "Mahsulot", ru: "Товар" }) },
                  { key: "amount", label: t({ en: "Amount", uz: "Summa", ru: "Сумма" }), sortable: true, align: "end", render: (v) => <span className="tabular-nums">${Number(v).toLocaleString("en-US")}</span> },
                  { key: "status", label: t({ en: "Status", uz: "Holat", ru: "Статус" }), render: (v) => <Chip size="sm" dot color={STATUS[v as Status].color}>{t(STATUS[v as Status].label)}</Chip> },
                  { key: "date", label: t({ en: "Date", uz: "Sana", ru: "Дата" }), render: (v) => <span className="text-muted">{formatDay(String(v), lang)}</span> },
                  {
                    key: "actions",
                    label: "",
                    align: "end",
                    render: (_v, r) => (
                      <div className="flex justify-end gap-0.5">
                        <Tooltip content={t({ en: "View", uz: "Ko'rish", ru: "Просмотр" })}><Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "View", uz: "Ko'rish", ru: "Просмотр" })}><Eye size={15} /></Button></Tooltip>
                        <Tooltip content={t({ en: "Edit", uz: "Tahrirlash", ru: "Изменить" })}><Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "Edit", uz: "Tahrirlash", ru: "Изменить" })}><Pencil size={15} /></Button></Tooltip>
                        <Tooltip content={t({ en: "Ship", uz: "Jo'natish", ru: "Отправить" })}><Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "Ship", uz: "Jo'natish", ru: "Отправить" })} onClick={() => addToast({ title: t({ en: `${r.id} shipped`, uz: `${r.id} jo'natildi`, ru: `${r.id} отправлен` }), icon: <Truck size={16} />, color: "accent" })}><Truck size={15} /></Button></Tooltip>
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
              <CardHeader title={t({ en: "Activity", uz: "Faollik", ru: "Активность" })} description={t({ en: "Last 24 hours", uz: "So'nggi 24 soat", ru: "За последние 24 часа" })} endContent={<Activity size={16} className="text-muted" />} />
              <CardBody>
                <Timeline
                  items={[
                    { id: "a1", title: t({ en: <><b className="font-medium">Dilnoza</b> shipped #3209</>, uz: <><b className="font-medium">Dilnoza</b> #3209 ni jo'natdi</>, ru: <><b className="font-medium">Дильноза</b> отправила #3209</> }), time: t({ en: "10 min", uz: "10 daq", ru: "10 мин" }), color: "accent", icon: <Truck size={14} /> },
                    { id: "a2", title: t({ en: "Payment received", uz: "To'lov qabul qilindi", ru: "Платёж получен" }), description: "Click · $599", time: t({ en: "1 h", uz: "1 soat", ru: "1 ч" }), color: "success", icon: <DollarSign size={14} /> },
                    { id: "a3", title: t({ en: <><b className="font-medium">Jasur</b> added a product</>, uz: <><b className="font-medium">Jasur</b> mahsulot qo'shdi</>, ru: <><b className="font-medium">Жасур</b> добавил товар</> }), time: t({ en: "3 h", uz: "3 soat", ru: "3 ч" }), icon: <Package size={14} />, content: <div className="rounded-xl bg-surface-secondary px-3 py-2 text-xs text-muted">5K display · {t({ en: "12 pcs", uz: "12 dona", ru: "12 шт." })} · $1,599</div> },
                    { id: "a4", title: t({ en: "Low stock", uz: "Zaxira kam qoldi", ru: "Заканчивается запас" }), description: t({ en: "Wireless earbuds — 4 left", uz: "Wireless earbuds — 4 dona", ru: "Wireless earbuds — 4 шт." }), time: t({ en: "5 h", uz: "5 soat", ru: "5 ч" }), color: "warning", icon: <AlertTriangle size={14} /> },
                  ]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title={t({ en: "Team", uz: "Jamoa", ru: "Команда" })}
                description={t({ en: "4 members · 3 online", uz: "4 a'zo · 3 onlayn", ru: "4 участника · 3 онлайн" })}
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
                      <p className="text-xs text-muted">{t(m.role)}</p>
                    </div>
                    <Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "Message", uz: "Xabar", ru: "Сообщение" })}><MessageSquare size={15} /></Button>
                  </div>
                ))}
                <Divider className="my-3" />
                <div className="flex items-center justify-between px-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t({ en: "Customer rating", uz: "Mijozlar bahosi", ru: "Оценка клиентов" })}</p>
                    <p className="text-xs text-muted">{t({ en: "1,240 reviews", uz: "1,240 ta sharh", ru: "1 240 отзывов" })}</p>
                  </div>
                  <Rating value={4.6} isReadOnly size="sm" showValue />
                </div>
              </CardBody>
            </Card>

            <Card className="flex flex-col">
              <CardHeader
                title={<span className="flex items-center gap-2"><Sparkles size={16} className="text-accent" /> {t({ en: "AI assistant", uz: "AI yordamchi", ru: "AI-ассистент" })}</span>}
                description={t({ en: "Ask about your sales", uz: "Savdo bo'yicha savol bering", ru: "Спросите о продажах" })}
                endContent={<Chip size="sm" color="success" dot>{t({ en: "Online", uz: "Onlayn", ru: "Онлайн" })}</Chip>}
              />
              <ChatContainer className="h-64 flex-1 space-y-4 overflow-y-auto px-4">
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} showActions={m.role === "assistant"}>{typeof m.text === "string" ? m.text : t(m.text)}</ChatMessage>
                ))}
                {chatLoading && <ChatMessage role="assistant" isTyping />}
              </ChatContainer>
              <div className="p-3">
                <PromptInput onSubmit={sendChat} isLoading={chatLoading} onStop={() => setChatLoading(false)} minRows={1} suggestions={[t({ en: "Weekly report", uz: "Haftalik hisobot", ru: "Недельный отчёт" }), t({ en: "Top customers", uz: "Eng yaxshi mijozlar", ru: "Лучшие клиенты" })]} />
              </div>
            </Card>
          </div>

          {/* Onboarding · Settings */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader title={t({ en: "Store setup", uz: "Do'konni sozlash", ru: "Настройка магазина" })} description={t({ en: `${step} / 4 steps done`, uz: `${step} / 4 bosqich bajarildi`, ru: `Выполнено шагов: ${step} / 4` })} />
              <CardBody className="space-y-6">
                <Stepper
                  currentStep={step}
                  onStepChange={setStep}
                  steps={[
                    { title: t({ en: "Profile", uz: "Profil", ru: "Профиль" }), description: t({ en: "Basic info", uz: "Asosiy ma'lumot", ru: "Основное" }) },
                    { title: t({ en: "Products", uz: "Mahsulotlar", ru: "Товары" }), description: t({ en: "Catalog", uz: "Katalog", ru: "Каталог" }) },
                    { title: t({ en: "Payments", uz: "To'lov", ru: "Оплата" }), description: "Click, Payme" },
                    { title: t({ en: "Launch", uz: "Ishga tushirish", ru: "Запуск" }) },
                  ]}
                />
                <Accordion variant="splitted" defaultExpandedKeys={new Set(["pay"])}>
                  <AccordionItem itemKey="pay" title={t({ en: "Connect payments", uz: "To'lov tizimini ulash", ru: "Подключить оплату" })} subtitle={t({ en: "Next step", uz: "Keyingi qadam", ru: "Следующий шаг" })} startContent={<CreditCard size={18} className="text-accent" />}>
                    <p className="text-sm text-muted">{t({ en: "Enter your Click or Payme keys so customers can pay by card.", uz: "Click yoki Payme kalitlarini kiriting — mijozlar karta orqali to'lay oladi.", ru: "Введите ключи Click или Payme — клиенты смогут платить картой." })}</p>
                    <Button size="sm" className="mt-3" onClick={() => setStep(Math.min(4, step + 1))}>{t({ en: "Connect", uz: "Ulash", ru: "Подключить" })}</Button>
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

            <Card>
              <CardHeader title={t({ en: "Notification settings", uz: "Bildirishnoma sozlamalari", ru: "Настройки уведомлений" })} description={t({ en: "Choose what you want to receive", uz: "Qaysi xabarlarni olishni tanlang", ru: "Выберите, какие уведомления получать" })} />
              <CardBody className="space-y-5">
                <div className="divide-y divide-separator rounded-2xl bg-surface-secondary px-4">
                  {[
                    { label: t({ en: "New orders", uz: "Yangi buyurtmalar", ru: "Новые заказы" }), desc: t({ en: "Instantly for every order", uz: "Har bir buyurtma haqida darhol", ru: "Сразу о каждом заказе" }), on: true },
                    { label: t({ en: "Daily report", uz: "Kunlik hisobot", ru: "Ежедневный отчёт" }), desc: t({ en: "Email every day at 09:00", uz: "Har kuni 09:00 da email", ru: "Email каждый день в 09:00" }), on: true },
                    { label: t({ en: "Marketing", uz: "Marketing xabarlari", ru: "Маркетинг" }), desc: t({ en: "News and offers", uz: "Yangiliklar va takliflar", ru: "Новости и предложения" }), on: false },
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
                <CheckboxGroup label={t({ en: "Channels", uz: "Kanallar", ru: "Каналы" })} orientation="horizontal" defaultValue={["email", "bot"]} variant="secondary">
                  <Checkbox value="email">Email</Checkbox>
                  <Checkbox value="sms">SMS</Checkbox>
                  <Checkbox value="bot">Chat bot</Checkbox>
                  <Checkbox value="push">Push</Checkbox>
                </CheckboxGroup>
                <RadioGroup label={t({ en: "Report frequency", uz: "Hisobot chastotasi", ru: "Частота отчётов" })} orientation="horizontal" defaultValue="daily" variant="secondary">
                  <Radio value="daily">{t({ en: "Daily", uz: "Kunlik", ru: "Ежедневно" })}</Radio>
                  <Radio value="weekly">{t({ en: "Weekly", uz: "Haftalik", ru: "Еженедельно" })}</Radio>
                  <Radio value="monthly">{t({ en: "Monthly", uz: "Oylik", ru: "Ежемесячно" })}</Radio>
                </RadioGroup>
              </CardBody>
              <CardFooter showDivider className="justify-end">
                <Button variant="tertiary">{t({ en: "Cancel", uz: "Bekor qilish", ru: "Отмена" })}</Button>
                <Button onClick={() => addToast({ title: t({ en: "Settings saved", uz: "Sozlamalar saqlandi", ru: "Настройки сохранены" }), color: "success" })}>{t({ en: "Save", uz: "Saqlash", ru: "Сохранить" })}</Button>
              </CardFooter>
            </Card>
          </div>

          <p className="pb-4 text-center text-xs text-muted">
            {t({ en: "This page is built entirely with", uz: "Bu sahifa to'liq", ru: "Эта страница целиком собрана из" })} <code className="font-mono">nr-ui-kit</code> {t({ en: "components", uz: "komponentlari bilan qurilgan", ru: "компонентов" })} · <a href="/" className="text-accent hover:underline">{t({ en: "Docs", uz: "Hujjatlar", ru: "Документация" })}</a>
          </p>
        </main>
      </div>

      <NewOrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
