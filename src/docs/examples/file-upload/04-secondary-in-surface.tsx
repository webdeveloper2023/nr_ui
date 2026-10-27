import { Button, FileUpload } from "nr-ui-kit";

export default function FileUploadSecondaryInSurface() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-surface p-5 shadow-surface">
      <p className="text-base font-medium text-foreground">Hujjatlarni yuklash</p>
      <p className="mb-4 mt-1 text-sm text-muted">Pasport nusxasi va diplomni biriktiring.</p>
      <FileUpload variant="secondary" accept=".pdf,image/*" maxSizeMB={10} />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="tertiary">Bekor qilish</Button>
        <Button>Yuborish</Button>
      </div>
    </div>
  );
}
