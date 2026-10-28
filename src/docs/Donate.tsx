import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "../components";
import { useT } from "./i18n/lang";

const DONATION_URL: string = "https://github.com/sponsors/webdeveloper2023";
const STORAGE_KEY = "nr-donate-last-shown";
const INTERVAL = 7 * 24 * 60 * 60 * 1000;

export function Donate() {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show automatic prompts when supporters can actually donate.
    if (!DONATION_URL) return;
    try {
      const lastShown = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (Date.now() - lastShown < INTERVAL) return;
    } catch { return; }
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* storage unavailable */ }
      setOpen(true);
    }, 60000);
    return () => window.clearTimeout(timer);
  }, []);

  const show = () => {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* storage unavailable */ }
    setOpen(true);
  };
  return <>
    <button type="button" onClick={show} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3 text-sm font-medium text-accent-soft-foreground transition-colors hover:bg-accent-soft-hover">
      <Heart size={16} /> {t({ en: "Donate", uz: "Donate", ru: "Поддержать" })}
    </button>
    <Modal isOpen={open} onClose={() => setOpen(false)} size="md" backdrop="blur">
      <ModalHeader>{t({ en: "Support NR UI", uz: "NR UI’ni qo‘llab-quvvatlang", ru: "Поддержать NR UI" })}</ModalHeader>
      <ModalBody>
        <p className="text-sm leading-6 text-muted">{t({ en: "NR UI is free for everyone. If it helps you, an optional donation can support its continued development. Thank you!", uz: "NR UI hamma uchun bepul. Agar u sizga foyda bersa, ixtiyoriy donate loyiha rivojiga yordam beradi. Rahmat!", ru: "NR UI бесплатен для всех. Если он вам полезен, добровольное пожертвование поможет развитию проекта. Спасибо!" })}</p>
        {!DONATION_URL && <p className="text-sm text-muted">{t({ en: "A donation link is being prepared.", uz: "Donate uchun havola tayyorlanmoqda.", ru: "Ссылка для пожертвований готовится." })}</p>}
      </ModalBody>
      <ModalFooter>
        <Button variant="tertiary" onClick={() => setOpen(false)}>{t({ en: "Maybe later", uz: "Keyinroq", ru: "Позже" })}</Button>
        {DONATION_URL && <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground">{t({ en: "Donate", uz: "Donate qilish", ru: "Поддержать" })}</a>}
      </ModalFooter>
    </Modal>
  </>;
}
