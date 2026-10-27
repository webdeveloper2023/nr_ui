import { useState } from "react";
import { Pagination } from "nr-ui-kit";

export default function PaginationCompact() {
  const [page, setPage] = useState(10);

  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination isCompact variant="tertiary" total={20} page={page} onChange={setPage} />
      <Pagination isCompact total={20} page={page} onChange={setPage} siblings={2} />
      <Pagination total={20} page={page} onChange={setPage} showControls={false} />
    </div>
  );
}
