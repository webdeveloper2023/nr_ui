import { FileUpload } from "nr-ui-kit";

// At most 3 files: extra ones are left out and a message explains why
export default function FileUploadMaxFiles() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <FileUpload layout="inline" maxFiles={3} label="Attach up to 3 files" description="Any type, 10 MB each" />
    </div>
  );
}
