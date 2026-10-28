import { Textarea } from "nr-ui-kit";

export default function TextareaAutosize() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Textarea
        label="Grows automatically"
        description="From 1 to 6 rows"
        minRows={1}
        maxRows={6}
        placeholder="Start typing..."
      />
      <Textarea label="Manual size" description="Drag the bottom corner" disableAutosize minRows={3} />
    </div>
  );
}
