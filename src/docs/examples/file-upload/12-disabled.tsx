import { FileUpload } from "nr-ui-kit";

export default function FileUploadDisabled() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <FileUpload isDisabled label="Uploads are temporarily disabled" description="Limit reached — upgrade your plan" />
    </div>
  );
}
