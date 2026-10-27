import { useState } from "react";
import { Pagination } from "nr-ui-kit";

export default function PaginationVariants() {
  const [page, setPage] = useState(3);

  return (
    <div className="flex flex-col items-center gap-6">
      {(["ghost", "tertiary", "surface"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted">{variant}</span>
          <Pagination variant={variant} total={8} page={page} onChange={setPage} />
        </div>
      ))}
    </div>
  );
}
