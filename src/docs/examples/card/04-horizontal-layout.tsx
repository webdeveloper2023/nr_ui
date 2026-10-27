import { X } from "lucide-react";
import { Button, Card } from "nr-ui-kit";

export default function CardHorizontal() {
  return (
    <Card className="mx-auto w-full max-w-xl flex-row gap-4 p-3">
      <img
        src="https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=300&h=300&fit=crop"
        alt="Gilos"
        className="h-28 w-28 shrink-0 rounded-2xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-sm font-medium text-foreground">Kreator dasturiga qo'shiling!</p>
          <Button isIconOnly variant="ghost" size="sm" aria-label="Yopish" className="-mt-1 -mr-1">
            <X size={14} />
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted">Kontent yarating, auditoriyangizni oshiring va har oy daromad oling.</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-medium text-foreground">Faqat 10 o'rin</span>
          <Button size="sm">Ariza berish</Button>
        </div>
      </div>
    </Card>
  );
}
