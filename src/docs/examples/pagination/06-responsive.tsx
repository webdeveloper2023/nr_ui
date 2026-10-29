import { useState } from "react";
import { Pagination } from "nr-ui-kit";

// Resize the window: on mobile the buttons are 44px and the sibling pages drop out, so it fits a phone.
export default function PaginationResponsive() {
  const [page, setPage] = useState(8);

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination responsive total={20} page={page} onChange={setPage} siblings={2} />
      <p className="text-sm text-muted">Page {page} of 20</p>
    </div>
  );
}
