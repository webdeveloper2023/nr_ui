# NR UI Kit

Pro darajadagi React komponent kutubxonasi — **React 18/19**, **Tailwind CSS v4**, **TypeScript**, to'liq **dark mode**.

45+ komponent: Button, Input, Select, Table, Modal, Dropdown, Toast, Sidebar, Pricing, AI Chat va boshqalar.

## O'rnatish

```bash
# GitHub'dan (private repo — GitHub'ga kirgan bo'lishingiz kerak)
npm install github:webdeveloper2023/nr_ui

# npm'ga publish qilingandan keyin
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

## Publish qilish

```bash
npm run build:lib
npm publish --access public
```

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
