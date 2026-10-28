import { useState } from "react";
import { Rating } from "nr-ui-kit";

const labels = ["Not rated", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function RatingControlled() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex flex-col items-center gap-2">
      <Rating value={value} onChange={setValue} size="lg" />
      <p className="text-sm text-muted">{labels[value]}</p>
    </div>
  );
}
