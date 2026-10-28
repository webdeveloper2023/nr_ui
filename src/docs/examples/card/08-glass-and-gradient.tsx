import { Music2, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

export default function CardGlassAndGradient() {
  return (
    <div className="relative grid w-full gap-4 overflow-hidden rounded-3xl p-6 sm:grid-cols-3 sm:p-8">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Card className="relative">
        <CardHeader title="Default" description="Bilinar-bilinmas gradient" />
        <CardBody className="text-muted">Oddiy kartalar uchun standart ko'rinish.</CardBody>
      </Card>
      <Card variant="flat" className="relative">
        <CardHeader title="Flat" description="Gradientsiz, tekis surface" />
        <CardBody className="text-muted">Zich jadval va formalar uchun.</CardBody>
      </Card>
      <Card variant="glass" className="relative">
        <CardHeader title="Hozir ijroda" description="Lo-fi beats · 2:41" endContent={<Music2 size={18} className="text-muted" />} />
        <CardFooter className="justify-center gap-1">
          <Button variant="ghost" isIconOnly size="sm" aria-label="Oldingi"><SkipBack size={16} /></Button>
          <Button variant="glass" isIconOnly aria-label="Pauza"><Pause size={18} /></Button>
          <Button variant="ghost" isIconOnly size="sm" aria-label="Keyingi"><SkipForward size={16} /></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
