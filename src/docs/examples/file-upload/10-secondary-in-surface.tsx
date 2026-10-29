import { Button, FileUpload } from "nr-ui-kit";

export default function FileUploadSecondaryInSurface() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-surface p-5 shadow-surface">
      <p className="text-base font-medium text-foreground">Upload documents</p>
      <p className="mb-4 mt-1 text-sm text-muted">Attach a copy of your passport and diploma.</p>
      <FileUpload variant="secondary" accept=".pdf,image/*" maxSizeMB={10} />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="tertiary">Cancel</Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}
