import { useState } from "react";
import { Pagination } from "nr-ui-kit";

export default function PaginationBasic() {
  const [page, setPage] = useState(4);

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination total={12} page={page} onChange={setPage} />
      <p className="text-sm text-muted">Sahifa {page} / 12</p>
    </div>
  );
}
