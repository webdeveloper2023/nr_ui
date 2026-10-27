import { useState } from "react";
import { Button, Chip } from "nr-ui-kit";

const initial = ["React", "TypeScript", "Tailwind", "Vite", "Node.js"];

export default function ChipClosable() {
  const [tags, setTags] = useState(initial);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <Chip key={tag} size="lg" color="accent" onClose={() => setTags(tags.filter((t) => t !== tag))}>
            {tag}
          </Chip>
        ))}
        {tags.length === 0 && <p className="text-sm text-muted">Teglar qolmadi</p>}
      </div>
      {tags.length < initial.length && (
        <Button size="sm" variant="tertiary" onClick={() => setTags(initial)}>
          Qaytarish
        </Button>
      )}
    </div>
  );
}
