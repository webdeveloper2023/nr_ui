import { FileUpload } from "nr-ui-kit";

// One row with a Browse button: takes little height, still accepts dropped files
export default function FileUploadInline() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <FileUpload layout="inline" size="sm" label="Invoice" description="PDF, up to 5 MB" maxSizeMB={5} accept=".pdf" />
      <FileUpload layout="inline" size="md" label="Contract" description="PDF or DOCX" accept=".pdf,.docx" />
      <FileUpload layout="inline" size="lg" label="Product photos" description="PNG or JPG, several at once" accept="image/*" />
      <FileUpload layout="inline" size="xl" label="Price list" description="XLSX or CSV" accept=".xlsx,.csv" />
    </div>
  );
}
