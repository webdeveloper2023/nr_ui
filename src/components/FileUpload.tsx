import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type FileUploadVariant = "default" | "secondary";

export interface FileUploadProps {
  /** Style: white surface or gray (inside a surface) */
  variant?: FileUploadVariant;
  /** Accepted file types (e.g. image/*) */
  accept?: string;
  /** Allows selecting multiple files */
  multiple?: boolean;
  /** Maximum file size (MB) */
  maxSizeMB?: number;
  /** Files (controlled) */
  files?: File[];
  /** Called when the file list changes */
  onFilesChange?: (files: File[]) => void;
  /** Upload progress per file name (0–100) */
  progress?: Record<string, number>;
  /** Shows thumbnails for images */
  showPreview?: boolean;
  /** Drop zone title */
  label?: string;
  /** Hint below the drop zone */
  description?: string;
  /** Disables uploading */
  isDisabled?: boolean;
  /** Adapts to the screen: compact drop zone with a 16px title and 44px remove buttons on mobile, 40px remove buttons on tablet, a taller drop zone on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

// Mobile: less padding, smaller radius, 16px title, 44px remove buttons. Tablet: 40px remove buttons. Desktop: taller drop zone.
const zoneR: BreakpointClasses = { m: "mobile:px-4 mobile:py-8 mobile:rounded-2xl", d: "desktop:py-14" };
const titleR: BreakpointClasses = { m: "mobile:text-base" };
const removeR: BreakpointClasses = { m: "mobile:w-11 mobile:h-11 mobile:-mr-1.5", t: "tablet:w-10 tablet:h-10 tablet:-mr-1" };

const formatSize = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

function usePreviews(files: File[], enabled: boolean) {
  const previews = useMemo(() => {
    const map = new Map<File, string>();
    if (enabled) files.forEach((f) => f.type.startsWith("image/") && map.set(f, URL.createObjectURL(f)));
    return map;
  }, [files, enabled]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);
  return previews;
}

export function FileUpload({
  variant = "default",
  accept,
  multiple = true,
  maxSizeMB = 10,
  files: filesProp,
  onFilesChange,
  progress,
  showPreview = true,
  label,
  description,
  isDisabled = false,
  responsive,
  className = "",
}: FileUploadProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filesState, setFilesState] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const files = filesProp ?? filesState;
  const previews = usePreviews(files, showPreview);
  const isSecondary = variant === "secondary";

  const update = (next: File[]) => {
    setFilesState(next);
    onFilesChange?.(next);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > maxSizeMB * 1024 ** 2);
    setError(tooBig.length ? t.fileUpload.tooLarge(tooBig.map((f) => f.name).join(", "), maxSizeMB) : null);
    const valid = incoming.filter((f) => f.size <= maxSizeMB * 1024 ** 2);
    update(multiple ? [...files, ...valid] : valid.slice(0, 1));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isDisabled) addFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "group flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center",
          "transition-colors duration-150",
          rx(bps, zoneR),
          "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragging
            ? "border-accent bg-accent-soft"
            : cn("border-border hover:border-accent/50", isSecondary ? "bg-surface-secondary" : "bg-surface"),
          isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150",
            isDragging ? "bg-accent text-accent-foreground" : "bg-default text-muted group-hover:text-foreground"
          )}
        >
          <UploadCloud size={20} />
        </div>
        <div>
          <p className={cn("text-sm font-medium text-foreground", rx(bps, titleR))}>{label ?? t.fileUpload.label}</p>
          <p className="mt-1 text-xs text-muted">{description ?? t.fileUpload.description(maxSizeMB)}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="mt-2 px-1 text-xs text-danger animate-fade-in">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => {
            const preview = previews.get(f);
            const pct = progress?.[f.name];
            const isDone = pct !== undefined && pct >= 100;
            return (
              <li
                key={`${f.name}-${i}`}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-2.5 pr-3 animate-slide-up",
                  isSecondary ? "bg-surface-secondary" : "bg-surface shadow-surface"
                )}
              >
                {preview ? (
                  <img src={preview} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 bg-default" />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-default text-muted shrink-0">
                    <FileText size={18} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                    {isDone && <CheckCircle2 size={14} className="shrink-0 text-success" />}
                  </div>
                  <p className="text-xs text-muted tabular-nums">
                    {formatSize(f.size)}
                    {pct !== undefined && !isDone && ` · ${Math.round(pct)}%`}
                  </p>
                  {pct !== undefined && !isDone && (
                    <div className="mt-1.5 h-1 w-full rounded-full bg-default overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-[width] duration-300 ease-(--ease-out-soft)" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => update(files.filter((_, j) => j !== i))}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-muted cursor-pointer shrink-0",
                    "hover:bg-danger-soft hover:text-danger transition-colors duration-150",
                    rx(bps, removeR),
                    "outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  )}
                  aria-label={t.fileUpload.remove(f.name)}
                >
                  <X size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
