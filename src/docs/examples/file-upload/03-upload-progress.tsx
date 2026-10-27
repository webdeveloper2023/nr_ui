import { useEffect, useState } from "react";
import { FileUpload } from "nr-ui-kit";

export default function FileUploadProgress() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Soxta yuklash: har bir yangi fayl uchun progressni oshirib boradi
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
      <FileUpload files={files} onFilesChange={setFiles} progress={progress} description="Fayl tanlang — yuklash jarayoni ko'rinadi" />
    </div>
  );
}
