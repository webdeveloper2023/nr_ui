import { useEffect, useState } from "react";
import { FileUpload } from "nr-ui-kit";

export default function FileUploadProgress() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Fake upload: keeps increasing progress for every new file
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = { ...prev };
        files.forEach((f) => (next[f.name] = Math.min(100, (next[f.name] ?? 0) + 8 + Math.random() * 12)));
        return next;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [files]);

  return (
    <div className="mx-auto w-full max-w-lg">
      <FileUpload files={files} onFilesChange={setFiles} progress={progress} description="Pick a file to see the upload progress" />
    </div>
  );
}
