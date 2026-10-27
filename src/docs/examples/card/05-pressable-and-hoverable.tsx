import { useState } from "react";
import { FileText, Image, Music } from "lucide-react";
import { Card, CardBody } from "nr-ui-kit";

const items = [
  { key: "docs", icon: <FileText size={18} />, title: "Hujjatlar", count: "128 fayl" },
  { key: "photos", icon: <Image size={18} />, title: "Rasmlar", count: "2 340 fayl" },
  { key: "music", icon: <Music size={18} />, title: "Musiqa", count: "86 fayl" },
];

export default function CardPressable() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.key} isPressable isHoverable onPress={() => setOpened(item.title)}>
            <CardBody className="gap-3 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">{item.icon}</span>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted">{item.count}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">{opened ? `Ochildi: ${opened}` : "Kartani bosing"}</p>
    </div>
  );
}
