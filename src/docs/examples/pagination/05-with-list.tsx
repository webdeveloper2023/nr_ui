import { useState } from "react";
import { Pagination } from "nr-ui-kit";

const items = Array.from({ length: 23 }, (_, i) => `Hisob-faktura #${1040 + i}`);
const perPage = 5;

export default function PaginationWithList() {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const visible = items.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-surface p-2 shadow-surface">
      <ul>
        {visible.map((item) => (
          <li key={item} className="flex h-12 items-center justify-between border-b border-separator px-3 text-sm last:border-0">
            <span className="text-foreground">{item}</span>
            <span className="text-muted">$240.00</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-muted">{items.length} ta yozuv</span>
        <Pagination size="sm" total={total} page={page} onChange={setPage} />
      </div>
    </div>
  );
}
