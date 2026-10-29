import { FileUpload } from "nr-ui-kit";

export default function FileUploadResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      {/* Compact drop zone and 44px remove buttons on mobile, taller drop zone on desktop */}
      <FileUpload responsive />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
