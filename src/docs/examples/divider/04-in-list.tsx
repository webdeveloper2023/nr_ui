import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { Card, Divider } from "nr-ui-kit";

const items = ["Profil", "Xavfsizlik", "Bildirishnomalar", "To'lovlar"];

export default function DividerInList() {
  return (
    <Card className="mx-auto w-full max-w-sm p-2">
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && <Divider className="mx-3 w-auto" />}
          <button className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-surface-secondary">
            {item}
            <ChevronRight size={16} className="text-muted" />
          </button>
        </Fragment>
      ))}
    </Card>
  );
}
