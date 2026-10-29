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
import { useT } from "../../i18n/lang";

// ─── Small pieces ───────────────────────────
export function ThemeButton() {
  const t = useT();
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
  const label = dark
    ? t({ en: "Light mode", uz: "Yorug' rejim", ru: "Светлая тема" })
    : t({ en: "Dark mode", uz: "Qorong'i rejim", ru: "Тёмная тема" });
  return (
    <Tooltip content={label} placement="bottom">
      <Button isIconOnly variant="ghost" aria-label={label} onClick={() => setDark(!dark)}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </Tooltip>
  );
}

export function Notifications() {
  const t = useT();
  const title = t({ en: "Notifications", uz: "Bildirishnomalar", ru: "Уведомления" });
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="ghost" aria-label={title}>
          <Badge content="3" color="danger" size="sm">
            <Bell size={18} />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="font-medium text-foreground">{title}</p>
          <Chip size="sm" color="accent">{t({ en: "3 new", uz: "3 ta yangi", ru: "3 новых" })}</Chip>
        </div>
        <div className="max-h-80 overflow-y-auto px-4 pb-4">
          <Timeline
            items={[
              {
                id: "n1",
                title: t({
                  en: <><b className="font-medium">Ali</b> placed a new order</>,
                  uz: <><b className="font-medium">Ali</b> yangi buyurtma berdi</>,
                  ru: <><b className="font-medium">Али</b> оформил новый заказ</>,
                }),
                time: t({ en: "2 min", uz: "2 daq", ru: "2 мин" }),
                color: "accent",
                icon: <ShoppingBag size={14} />,
              },
              {
                id: "n2",
                title: t({ en: "Payment received", uz: "To'lov qabul qilindi", ru: "Платёж получен" }),
                description: "#3207 · $599",
                time: t({ en: "1 h", uz: "1 soat", ru: "1 ч" }),
                color: "success",
                icon: <CheckCircle2 size={14} />,
              },
              {
                id: "n3",
                title: t({ en: "Low stock", uz: "Ombor zaxirasi kam", ru: "Мало на складе" }),
                description: t({ en: "Wireless earbuds — 4 left", uz: "Wireless earbuds — 4 dona qoldi", ru: "Wireless earbuds — осталось 4 шт." }),
                time: t({ en: "3 h", uz: "3 soat", ru: "3 ч" }),
                color: "warning",
                icon: <AlertTriangle size={14} />,
              },
            ]}
          />
        </div>
        <Divider />
        <div className="p-2">
          <Button variant="ghost" size="sm" fullWidth>{t({ en: "View all", uz: "Barchasini ko'rish", ru: "Смотреть все" })}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserMenu() {
  const t = useT();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label={t({ en: "Profile", uz: "Profil", ru: "Профиль" })}>
          <Avatar src={avatarUrl("rafiqjon")} name="Rafiqjon Nazirov" size="sm" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label={t({ en: "Profile menu", uz: "Profil menyusi", ru: "Меню профиля" })}>
        <DropdownSection showDivider>
          <DropdownItem itemKey="me" description="admin@nr-ui.uz" startContent={<User size={16} />}>Rafiqjon Nazirov</DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem itemKey="settings" startContent={<Settings size={16} />} shortcut="Ctrl ,">{t({ en: "Settings", uz: "Sozlamalar", ru: "Настройки" })}</DropdownItem>
          <DropdownItem itemKey="billing" startContent={<CreditCard size={16} />}>{t({ en: "Billing", uz: "To'lovlar", ru: "Оплата" })}</DropdownItem>
          <DropdownItem itemKey="help" startContent={<HelpCircle size={16} />}>{t({ en: "Help", uz: "Yordam", ru: "Помощь" })}</DropdownItem>
        </DropdownSection>
        <DropdownItem itemKey="logout" color="danger" startContent={<LogOut size={16} />}>{t({ en: "Log out", uz: "Chiqish", ru: "Выйти" })}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function CardMenu() {
  const t = useT();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="ghost" aria-label={t({ en: "Actions", uz: "Amallar", ru: "Действия" })}><MoreVertical size={16} /></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={t({ en: "Card actions", uz: "Karta amallari", ru: "Действия карточки" })}>
        <DropdownItem itemKey="view" startContent={<Eye size={16} />}>{t({ en: "Details", uz: "Batafsil", ru: "Подробнее" })}</DropdownItem>
        <DropdownItem itemKey="export" startContent={<Download size={16} />}>{t({ en: "Export", uz: "Eksport", ru: "Экспорт" })}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ─── New order modal ────────────────────────
export function NewOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useT();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = (close: () => void) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      close();
      addToast({
        title: t({ en: "Order created", uz: "Buyurtma yaratildi", ru: "Заказ создан" }),
        description: t({ en: "#3211 · customer notified", uz: "#3211 · mijozga xabar yuborildi", ru: "#3211 · клиент уведомлён" }),
        color: "success",
      });
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              {t({ en: "New order", uz: "Yangi buyurtma", ru: "Новый заказ" })}
              <p className="text-sm font-normal text-muted">
                {t({ en: "Enter customer and product details", uz: "Mijoz va mahsulot ma'lumotlarini kiriting", ru: "Введите данные клиента и товара" })}
              </p>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={t({ en: "Customer name", uz: "Mijoz ismi", ru: "Имя клиента" })}
                  placeholder={t({ en: "First Last", uz: "Ism Familiya", ru: "Имя Фамилия" })}
                  variant="secondary"
                  isRequired
                  startContent={<User size={16} />}
                />
                <Input label="Email" type="email" placeholder="customer@mail.com" variant="secondary" />
                <Select
                  label={t({ en: "Product", uz: "Mahsulot", ru: "Товар" })}
                  variant="secondary"
                  items={[
                    { key: "laptop", label: "Laptop Pro 14", description: "$1,999", startContent: <Box size={16} /> },
                    { key: "phone", label: "Phone X Pro", description: "$1,199", startContent: <Box size={16} /> },
                    { key: "tablet", label: "Tablet Air 11", description: "$599", startContent: <Box size={16} /> },
                  ]}
                />
                <Input label={t({ en: "Quantity", uz: "Miqdor", ru: "Количество" })} type="number" defaultValue="1" variant="secondary" />
              </div>
              <RadioGroup label={t({ en: "Delivery", uz: "Yetkazib berish", ru: "Доставка" })} orientation="horizontal" defaultValue="courier" variant="secondary">
                <Radio value="courier" description={t({ en: "1–2 days", uz: "1–2 kun", ru: "1–2 дня" })}>{t({ en: "Courier", uz: "Kuryer", ru: "Курьер" })}</Radio>
                <Radio value="pickup" description={t({ en: "Today", uz: "Bugun", ru: "Сегодня" })}>{t({ en: "Pickup", uz: "Olib ketish", ru: "Самовывоз" })}</Radio>
                <Radio value="post" description={t({ en: "3–5 days", uz: "3–5 kun", ru: "3–5 дней" })}>{t({ en: "Post", uz: "Pochta", ru: "Почта" })}</Radio>
              </RadioGroup>
              <Textarea
                label={t({ en: "Note", uz: "Izoh", ru: "Комментарий" })}
                placeholder={t({ en: "Additional details...", uz: "Qo'shimcha ma'lumot...", ru: "Дополнительная информация..." })}
                variant="secondary"
                maxLength={200}
                showCount
              />
              <FileUpload
                variant="secondary"
                maxSizeMB={5}
                label={t({ en: "Click to upload or drag a file here", uz: "Yuklash uchun bosing yoki faylni shu yerga tashlang", ru: "Нажмите для загрузки или перетащите файл сюда" })}
                description={t({ en: "Invoice or image — up to 5 MB", uz: "Hisob-faktura yoki rasm — 5 MB gacha", ru: "Счёт или изображение — до 5 МБ" })}
              />
              <Checkbox variant="secondary" defaultSelected>
                {t({ en: "Send SMS to the customer", uz: "Mijozga SMS xabar yuborish", ru: "Отправить клиенту SMS" })}
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button variant="tertiary" onClick={close}>{t({ en: "Cancel", uz: "Bekor qilish", ru: "Отмена" })}</Button>
              <Button isLoading={saving} onClick={() => save(close)}>{t({ en: "Save", uz: "Saqlash", ru: "Сохранить" })}</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// ─── Upgrade modal (pricing) ────────────────
export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useT();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const { addToast } = useToast();
  const choose = (plan: string) => {
    onClose();
    addToast({
      title: t({ en: `${plan} plan selected`, uz: `${plan} tarifi tanlandi`, ru: `Выбран тариф ${plan}` }),
      description: t({ en: "Redirecting to checkout…", uz: "To'lov sahifasiga yo'naltirilmoqda…", ru: "Переход к оплате…" }),
      color: "accent",
    });
  };
  const analytics = t({ en: "Analytics", uz: "Analitika", ru: "Аналитика" });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>{t({ en: "Choose a plan", uz: "Tarifni tanlang", ru: "Выберите тариф" })}</ModalHeader>
        <ModalBody>
          <div className="mb-8 flex justify-center">
            <BillingToggle
              value={period}
              onChange={setPeriod}
              labels={{
                monthly: t({ en: "Monthly", uz: "Oylik", ru: "Ежемесячно" }),
                yearly: t({ en: "Yearly", uz: "Yillik", ru: "Ежегодно" }),
              }}
            />
          </div>
          <div className="grid items-start gap-4 md:grid-cols-3">
            <PricingCard
              name="Starter"
              description={t({ en: "For small shops", uz: "Kichik do'konlar uchun", ru: "Для небольших магазинов" })}
              icon={<Sparkles size={18} />}
              price={{ monthly: 0, yearly: 0 }}
              period={period}
              features={[
                t({ en: "100 orders/month", uz: "100 ta buyurtma/oy", ru: "100 заказов/мес" }),
                t({ en: "1 user", uz: "1 foydalanuvchi", ru: "1 пользователь" }),
                { label: analytics, included: false },
              ]}
              ctaLabel={t({ en: "Current plan", uz: "Joriy tarif", ru: "Текущий тариф" })}
              onSelect={() => choose("Starter")}
            />
            <PricingCard
              name="Pro"
              description={t({ en: "Growing businesses", uz: "O'sayotgan bizneslar", ru: "Растущий бизнес" })}
              icon={<Rocket size={18} />}
              price={{ monthly: 29, yearly: 279 }}
              period={period}
              isPopular
              popularLabel={t({ en: "Popular", uz: "Mashhur", ru: "Популярный" })}
              ctaLabel={t({ en: "Get started", uz: "Boshlash", ru: "Начать" })}
              features={[
                t({ en: "Unlimited orders", uz: "Cheksiz buyurtma", ru: "Безлимитные заказы" }),
                t({ en: "10 users", uz: "10 foydalanuvchi", ru: "10 пользователей" }),
                analytics,
                t({ en: "AI assistant", uz: "AI yordamchi", ru: "AI-ассистент" }),
              ]}
              onSelect={() => choose("Pro")}
            />
            <PricingCard
              name="Enterprise"
              description={t({ en: "Large companies", uz: "Katta kompaniyalar", ru: "Крупные компании" })}
              icon={<Building2 size={18} />}
              price="Custom"
              period={period}
              variant="inverse"
              features={["SSO & SAML", "SLA 99.99%", t({ en: "Dedicated manager", uz: "Shaxsiy menejer", ru: "Персональный менеджер" })]}
              ctaLabel={t({ en: "Contact us", uz: "Bog'lanish", ru: "Связаться" })}
              onSelect={() => choose("Enterprise")}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
