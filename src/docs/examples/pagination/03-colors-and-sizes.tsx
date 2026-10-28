import { useState } from "react";
import { Pagination } from "nr-ui-kit";

export default function PaginationColorsAndSizes() {
  const [page, setPage] = useState(2);

  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination color="accent" total={6} page={page} onChange={setPage} />
      <Pagination size="xs" total={6} page={page} onChange={setPage} />
      <Pagination size="sm" total={6} page={page} onChange={setPage} />
      <Pagination size="lg" color="accent" variant="tertiary" total={6} page={page} onChange={setPage} />
    </div>
  );
}
