import { FileUpload } from "nr-ui-kit";

export default function FileUploadBasic() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <FileUpload maxSizeMB={5} description="PNG, JPG yoki PDF — 5 MB gacha" />
    </div>
  );
}
