import { useState } from "react";
import { Chip } from "nr-ui-kit";

// Resize the window: on mobile chips grow a step and the close button gets a finger-sized hit area.
export default function ChipResponsive() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Vite"]);
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tags.map((tag) => (
        <Chip key={tag} responsive onClose={() => setTags((t) => t.filter((x) => x !== tag))}>
          {tag}
        </Chip>
      ))}
    </div>
  );
}
