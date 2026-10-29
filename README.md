# NR UI Kit

Pro darajadagi React komponent kutubxonasi — **React 18/19**, **Tailwind CSS v4**, **TypeScript**, to'liq **dark mode**.

47 ta komponent (ichki qismlari — `ModalHeader`, `CardBody`, `SidebarItem` va h.k. — bilan birga 82 ta): Container, Stack, Grid, LineChart, AreaChart, BarChart, PieChart, Button, Input, Label, Form, AmountInput (summa so'z bilan), Select, Table, Modal, Dropdown, Toast, Sidebar, Pricing, AI Chat va boshqalar.

## O'rnatish

NR UI Kit bepul va MIT litsenziyasi asosida foydalanish mumkin.

```bash
npm install nr-ui-kit
```

Talablar: `react >= 18`, `react-dom >= 18`. `lucide-react` avtomatik o'rnatiladi.

## Stillarni ulash

**A) Loyihada Tailwind v4 bor bo'lsa (tavsiya etiladi):**

```css
/* src/index.css */
@import "tailwindcss";
@import "nr-ui-kit/theme.css";
```

Shunda o'z kodingizda ham `bg-surface`, `text-muted`, `bg-accent`, `bg-accent-soft`, `shadow-surface` kabi tokenlar ishlaydi.

**B) Tailwind'siz — tayyor CSS:**

```ts
import "nr-ui-kit/styles.css";
```

**Shrift (ixtiyoriy):** dizayn Inter shrifti uchun moslangan:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

## Ishlatish

```tsx
import { ToastProvider, Button, Input, Card, CardBody, useToast } from "nr-ui-kit";

function Form() {
  const { addToast } = useToast();
  return (
    <Card className="max-w-sm">
      <CardBody className="space-y-3">
        <Input label="Email" type="email" variant="secondary" />
        <Button fullWidth onClick={() => addToast({ title: "Yuborildi!", color: "success" })}>
          Yuborish
        </Button>
      </CardBody>
    </Card>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Form />
    </ToastProvider>
  );
}
```

## Responsive

Har bir komponent `responsive` propini qabul qiladi:

| Yozilishi | Natija |
| --- | --- |
| `responsive` | to'rtala breakpointga moslashadi |
| `responsive={["m", "t"]}` | faqat mobile va tablet'ga; laptop / desktop'da oddiy ko'rinish |
| `responsive="m"` | faqat mobile'ga |

Breakpointlar: `m` mobile (< 768px), `t` tablet (768–1023px), `l` laptop (1024–1535px), `d` desktop (≥ 1536px).

Mobile'da tugma va maydonlar 44px balandlikka chiqadi, matn 16px bo'ladi, shuning uchun kattalashmaydi. Modal pastdan chiqadigan sheet'ga, qatorlar ustunga aylanadi. Desktop'da padding kengayadi.

```tsx
import { ResponsiveProvider, Container, Grid, Stack, Card, Button, Show } from "nr-ui-kit";

<ResponsiveProvider>              {/* hamma komponentga birdan yoqadi */}
  <Container>                     {/* chetki bo'shliq: 16 → 20 → 24 → 28px */}
    <Grid cols={3}>               {/* mobile 1, tablet 2, laptop/desktop 3 ustun */}
      <Card>…</Card>
    </Grid>
    <Stack direction="row">       {/* mobile'da ustunga aylanadi */}
      <Button responsive={false}>Doim oddiy</Button>
      <Show on={["m"]}>Faqat mobile'da</Show>
    </Stack>
  </Container>
</ResponsiveProvider>
```

Barcha gap va padding'lar bitta umumiy shkaladan olinadi (`xs … 2xl`), shuning uchun komponentlar bir-biriga mos turadi. Har bir breakpoint uchun aniq qiymat ham berish mumkin: `cols={{ m: 1, t: 2, l: 4 }}`. `useBreakpoint()` hozirgi breakpointni qaytaradi.

Tailwind ishlatayotgan bo'lsangiz, `theme.css` sizga ham `mobile:`, `tablet:`, `laptop:`, `desktop:` variantlarini beradi.

## Grafiklar (Charts)

`LineChart`, `AreaChart`, `BarChart`, `PieChart` — tashqi kutubxonasiz, toza SVG.

```tsx
import { LineChart, BarChart, PieChart } from "nr-ui-kit";

<LineChart
  aria-label="Oylik daromad"
  data={[{ oy: "Yan", web: 120, app: 80 }, { oy: "Fev", web: 150, app: 95 }]}
  xKey="oy"
  series={[{ key: "web", label: "Web" }, { key: "app", label: "Ilova" }]}
  showRangeSelector   // pastda oraliqni tanlash uchun mini grafik
  responsive          // mobile'da pastroq, kamroq belgi, teginishga qulay legend
/>

<BarChart data={data} xKey="oy" series={series} isStacked showValues />
<PieChart variant="donut" data={[{ key: "a", label: "Karta", value: 52 }, { key: "b", label: "Naqd", value: 48 }]} />
```

- **Legend tugmalari** seriyani yashiradi yoki ko'rsatadi, o'q esa animatsiya bilan qayta hisoblanadi.
- **Tooltip** kursor yoki teginish bilan ishlaydi. Klaviaturada ← → tugmalari bilan yuriladi.
- **Ranglar** qat'iy tartibli 8 rangli palitradan olinadi (`--color-chart-1 … 8`, light va dark). Palitra rang ko'rlikka chidamlilik bo'yicha tekshirilgan.
- **Ekran o'quvchilar** uchun har bir grafikda yashirin ma'lumot jadvali bor.
- **PieChart turlari:** `pie`, `donut`, `semi` (yarim halqa), `polar` (teng burchaklar, qiymatni radius ko'rsatadi), `radial` (har element uchun alohida halqa).
- **Yumaloq burchaklar:** pie bo'laklarida `cornerRadius` va `gap`, bar'larda `radius`. Yozuvlar `labels="inside" | "outside"` bilan chiqadi (tashqi yozuvlar chiziq bilan bog'lanadi).

## Label va Form

Har bir field (`Input`, `Textarea`, `Select`, `PhoneInput`, `AmountInput`) label'ni 5 xil joylashtiradi:

| `labelPlacement` | Ko'rinishi |
| --- | --- |
| `outside` | field tepasida (standart) |
| `outside-left` | field yonida |
| `inside` | box ichida, kichik, doim tepada |
| `floating` | placeholder o'rnida turadi, focus yoki qiymat kiritilganda chegara chizig'iga chiqadi va chiziq uning atrofida uziladi |
| `floating-inside` | placeholder o'rnida turadi, focus yoki qiymatda box ichida tepaga ko'tariladi |

Har bir label'ga quyidagilar qo'shiladi:

- `isRequired` (`*`) yoki `isOptional` ("Ixtiyoriy");
- `necessityIndicator="text"` bilan "Majburiy" / "Ixtiyoriy" so'zlari;
- `labelTooltip` (info ikonka);
- `labelEndContent` (masalan "Parolni unutdingizmi?" havolasi yoki hisoblagich).

`Label` komponentini alohida, istalgan control uchun ham ishlatish mumkin.

`Form` ichidagi barcha field'larni bitta joydan boshqaradi. Field'ning o'z propi baribir ustun turadi:

```tsx
import { Form, Input, Select, Button } from "nr-ui-kit";

<Form
  labelPlacement="floating"   // hamma field'da floating label
  size="lg"
  showOptional                // majburiy bo'lmaganlarga "Ixtiyoriy"
  isDisabled={saving}         // hammasini birdan o'chiradi
  onValues={(values) => save(values)}   // { email: "...", plan: "pro" }
>
  <Input name="email" label="Email" isRequired />
  <Select name="plan" label="Tarif" items={plans} />
  <Button type="submit">Saqlash</Button>
</Form>
```

`labelPlacement="outside-left"` bilan birga `labelWidth={140}` bersangiz, barcha field'lar bitta ustunda tekis turadi. Mobile'da label'lar tepaga o'tadi.

## Dark mode

```ts
document.documentElement.classList.toggle("dark", isDark);
```

## Theme

Ranglarni o'zgartirish uchun tokenlarni qayta e'lon qiling:

```css
@import "tailwindcss";
@import "nr-ui-kit/theme.css";

@theme {
  --color-accent: #7c3aed;
  --color-accent-hover: #8b5cf6;
  --color-accent-soft-foreground: #6d28d9;
}
```

## Hujjatlar (docs sayt)

Har bir komponent sahifasida jonli misollar, **Show code**, props jadvali va to'liq source kod bor:

```bash
npm install
npm run dev        # http://localhost:5199
```

## Skriptlar

| Buyruq | Vazifasi |
| --- | --- |
| `npm run dev` | Docs saytini ishga tushirish (props jadvalini qayta generatsiya qiladi) |
| `npm run build` | Docs saytini `docs-dist/` ga build qilish |
| `npm run build:lib` | npm paketini `dist/` ga build qilish (JS, CJS, types, CSS) |
| `npm run gen:props` | `src/docs/props.json` ni komponent type'laridan generatsiya qilish |

## Litsenziya

MIT — foydalanish, o'zgartirish va tarqatish mumkin. Batafsil `LICENSE` faylida.

## Struktura

```
src/
  components/   # kutubxona komponentlari (paketga kiradi)
  lib/cn.ts     # class helper
  styles/       # theme.css (tokenlar), prebuilt.css
  lib.ts        # paket entry
  docs/         # docs sayt: registry, sahifalar, examples/<slug>/*.tsx
scripts/        # gen-props.mjs, copy-theme.mjs
```
