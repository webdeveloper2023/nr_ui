import { useState } from "react";
import { FileUpload, Tabs } from "nr-ui-kit";

// A grid of tiles: each picked image becomes a tile; the "Add" tile disappears at maxFiles
export default function FileUploadGallery() {
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Tabs
        size="sm"
        selectedKey={size}
        onSelectionChange={(key) => setSize(key as typeof size)}
        tabs={["sm", "md", "lg", "xl"].map((key) => ({ key, title: key }))}
      />
      <FileUpload
        layout="gallery"
        size={size}
        accept="image/*"
        maxFiles={8}
        files={files}
        onFilesChange={setFiles}
        description={`${files.length} / 8 photos`}
      />
    </div>
  );
}
