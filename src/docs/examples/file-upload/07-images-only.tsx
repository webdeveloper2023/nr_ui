import { useState } from "react";
import { FileUpload } from "nr-ui-kit";

export default function FileUploadImagesOnly() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <FileUpload accept="image/*" files={files} onFilesChange={setFiles} label="Drop images here" description="Image files only, with previews" />
      <p className="px-1 text-xs text-muted">{files.length} image(s) selected</p>
    </div>
  );
}
