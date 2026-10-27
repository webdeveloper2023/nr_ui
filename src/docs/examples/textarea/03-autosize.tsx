import { Textarea } from "nr-ui-kit";

export default function TextareaAutosize() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Textarea
        label="Avtomatik o'sadi"
        description="1 dan 6 qatorgacha"
        minRows={1}
        maxRows={6}
        placeholder="Yozishni boshlang..."
      />
      <Textarea label="Qo'lda o'lcham" description="Pastki burchakdan torting" disableAutosize minRows={3} />
    </div>
  );
}
