import { useState, type FormEvent } from "react";
import { Check, CreditCard, Infinity as InfinityIcon, Mail, Package, RefreshCw, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Accordion, AccordionItem, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "nr-ui-kit";
import { CodeBlock } from "./CodeBlock";
import { PURCHASE } from "./purchase.config";
import { registry } from "./registry";

// lucide-react ships no brand icons — GitHub mark inline
function Github({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

// GitHub username rules: 1–39 chars, alphanumeric or single hyphens, no leading/trailing hyphen
const GITHUB_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURES = [
  `${registry.length}+ komponent sahifasi va 45+ komponent`,
  "Vivid ranglari, dark mode, Frosted va Liquid",
  "To'liq source kod va TypeScript type'lari",
  "Umrbod yangilanishlar — qo'shimcha to'lovsiz",
  "npm orqali o'rnatish (GitHub'dan)",
  "Docs sayt: misollar, props jadvali, Dashboard namunasi",
];

const STEPS = [
  { icon: Github, title: "GitHub username", text: "Kirish beriladigan GitHub akkauntingizni kiriting." },
  { icon: CreditCard, title: `${PURCHASE.currency}${PURCHASE.price} to'lov`, text: "Bir martalik to'lov. Obuna yo'q, oylik to'lov yo'q." },
  { icon: Mail, title: "GitHub taklifi", text: `${PURCHASE.inviteEta} private repo'ga taklif (invite) keladi — uni qabul qilasiz.` },
  { icon: Terminal, title: "O'rnatish", text: "npm install bilan loyihangizga qo'shasiz va ishlatasiz." },
];

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_78%)]">
      <div className="absolute -left-24 -top-24 size-80 rounded-full bg-blue opacity-60 blur-3xl" />
      <div className="absolute -right-16 top-10 size-96 rounded-full bg-purple opacity-45 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 size-80 rounded-full bg-mint opacity-45 blur-3xl" />
    </div>
  );
}

export default function PricingPage() {
  const [github, setGithub] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const githubInvalid = touched && !GITHUB_RE.test(github.trim().replace(/^@/, ""));
  const emailInvalid = touched && !EMAIL_RE.test(email.trim());
  const username = github.trim().replace(/^@/, "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!GITHUB_RE.test(username) || !EMAIL_RE.test(email.trim())) return;
    if (PURCHASE.checkoutUrl) {
      const url = new URL(PURCHASE.checkoutUrl);
      url.searchParams.set("github", username);
      url.searchParams.set("email", email.trim());
      window.open(url.toString(), "_blank", "noopener");
    } else {
      setPendingOpen(true);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Hero */}
      <div className="text-center">
        <Chip variant="soft" color="accent" startContent={<InfinityIcon size={13} />}>Bir marta to'lov · Umrbod</Chip>
        <h1 className="mt-5 text-[44px] sm:text-[56px] font-bold leading-[1.05] tracking-tight text-foreground">
          Bir marta oling.
          <br />
          <span className="bg-gradient-to-r from-blue via-indigo to-purple bg-clip-text text-transparent">Umrbod ishlating.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-muted">
          NR UI Kit — {PURCHASE.currency}{PURCHASE.price} evaziga butun kutubxona, barcha kelajakdagi yangilanishlar va private GitHub repo'ga doimiy kirish.
        </p>
      </div>

      {/* Plan + checkout */}
      <div className="relative mt-12 rounded-[2rem] p-3 sm:p-4">
        <Backdrop />
        <div className="relative grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          {/* Plan */}
          <div className="glass rounded-3xl p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-indigo text-white">
                <Package size={18} />
              </span>
              <p className="text-lg font-semibold text-foreground">NR UI Kit — Lifetime</p>
            </div>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-6xl font-bold tracking-tight text-foreground">{PURCHASE.currency}{PURCHASE.price}</span>
              <span className="mb-2 text-sm text-muted">bir marta · USD</span>
            </div>
            <p className="mt-2 text-sm text-muted">Obuna yo'q. Keyingi barcha versiyalar tekin.</p>
            <ul className="mt-7 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Checkout */}
          <form onSubmit={submit} noValidate className="glass-thick rounded-3xl p-7 sm:p-8 flex flex-col">
            <p className="text-lg font-semibold text-foreground">Sotib olish</p>
            <p className="mt-1 text-sm text-muted">
              Kutubxona private GitHub repo orqali beriladi, shuning uchun GitHub akkauntingizga ruxsat (invite) yuboramiz.
            </p>
            <div className="mt-6 space-y-4">
              <Input
                label="GitHub username"
                placeholder="masalan: webdeveloper2023"
                value={github}
                onValueChange={setGithub}
                startContent={<Github size={16} className="text-muted" />}
                isRequired
                isInvalid={githubInvalid}
                errorMessage="GitHub username noto'g'ri (faqat harf, raqam va '-')"
                description="Shu akkauntga repo'ga kirish beriladi"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onValueChange={setEmail}
                startContent={<Mail size={16} className="text-muted" />}
                isRequired
                isInvalid={emailInvalid}
                errorMessage="Email manzil noto'g'ri"
                description="Chek va taklif haqida xabar uchun"
              />
            </div>
            <div className="mt-auto pt-7">
              <Button type="submit" size="lg" radius="full" fullWidth startContent={<Sparkles size={18} />}>
                {PURCHASE.currency}{PURCHASE.price} — Sotib olish
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheck size={13} /> Bir martalik to'lov · Avtomatik yechib olinmaydi
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* How it works */}
      <h2 className="mt-20 mb-6 text-[28px] font-semibold tracking-tight text-foreground">Qanday ishlaydi</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="rounded-2xl bg-surface-gradient p-5 shadow-surface">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
                <Icon size={18} />
              </span>
              <span className="text-sm font-semibold text-muted">0{i + 1}</span>
            </div>
            <p className="mt-4 font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <CodeBlock language="bash" fileName="Taklifni qabul qilgandan keyin" code={`npm install github:${PURCHASE.repo}`} />
      </div>

      {/* FAQ */}
      <h2 className="mt-20 mb-6 text-[28px] font-semibold tracking-tight text-foreground">Savollar</h2>
      <Accordion variant="splitted">
        <AccordionItem itemKey="once" title="Haqiqatan bir martalikmi?" startContent={<InfinityIcon size={18} className="text-accent" />}>
          Ha. {PURCHASE.currency}{PURCHASE.price} bir marta to'lanadi — obuna ham, oylik to'lov ham yo'q. Repo'ga kirish doimiy qoladi.
        </AccordionItem>
        <AccordionItem itemKey="updates" title="Yangilanishlar ham tekinmi?" startContent={<RefreshCw size={18} className="text-success" />}>
          Ha. Repo'ga qo'shilgan har bir yangi komponent va tuzatishni <code className="font-mono text-[13px]">npm update</code> bilan olasiz.
        </AccordionItem>
        <AccordionItem itemKey="github" title="Nega GitHub ruxsati kerak?" startContent={<Github size={18} className="text-foreground" />}>
          Kutubxona private GitHub repo'da saqlanadi. To'lovdan keyin akkauntingizga taklif (invite) yuboriladi — qabul qilganingizdan so'ng{" "}
          <code className="font-mono text-[13px]">npm install github:{PURCHASE.repo}</code> ishlaydi. Shuning uchun to'g'ri GitHub username kiritish muhim.
        </AccordionItem>
        <AccordionItem itemKey="when" title="Taklif qachon keladi?" startContent={<Mail size={18} className="text-warning" />}>
          {PURCHASE.inviteEta}. Taklif GitHub'dagi email manzilingizga va github.com/notifications ga keladi.
        </AccordionItem>
      </Accordion>

      {/* Payment not connected yet */}
      <Modal isOpen={pendingOpen} onClose={() => setPendingOpen(false)} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>So'rov qabul qilindi</ModalHeader>
              <ModalBody className="space-y-3 text-sm text-muted">
                <p>
                  Onlayn to'lov hali ulanmagan. To'lov va <b className="text-foreground">@{username}</b> akkauntiga GitHub taklifi uchun biz bilan bog'laning.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={onClose}>Yopish</Button>
                {PURCHASE.contactUrl && (
                  <Button onClick={() => window.open(PURCHASE.contactUrl, "_blank", "noopener")}>Bog'lanish</Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
