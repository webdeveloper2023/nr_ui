import { FileUpload } from "nr-ui-kit";

// Four sizes: padding, icon, text and the file list all scale together
export default function FileUploadSizes() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <FileUpload size="sm" description="sm — fits a sidebar or a table cell" />
      <FileUpload size="md" description="md — the default" />
      <FileUpload size="lg" description="lg — a section of a form" />
      <FileUpload size="xl" description="xl — the main action of a page" />
    </div>
  );
}
