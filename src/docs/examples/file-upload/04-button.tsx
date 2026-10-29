import { FileUpload } from "nr-ui-kit";

// A plain button that opens the file picker; the chosen files are listed below it
export default function FileUploadButton() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <FileUpload layout="button" size="sm" label="Attach" />
      <FileUpload layout="button" size="md" />
      <FileUpload layout="button" size="lg" label="Upload resume" description="PDF, up to 10 MB" accept=".pdf" />
      <FileUpload layout="button" size="xl" label="Upload documents" />
    </div>
  );
}
