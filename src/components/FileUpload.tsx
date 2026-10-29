import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { UploadCloud, FileText, X, CheckCircle2, ImagePlus, Plus, Upload } from "lucide-react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { Button } from "./Button";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type FileUploadVariant = "default" | "secondary" | "flat";
type FileUploadSize = "sm" | "md" | "lg" | "xl";
type FileUploadLayout = "dropzone" | "inline" | "button" | "avatar" | "gallery";

export interface FileUploadProps {
  /** Look of the picker: dropzone (large drop area), inline (one row with a Browse button), button (a plain button), avatar (one round image), gallery (grid of tiles) */
  layout?: FileUploadLayout;
  /** Size: sm, md, lg, xl */
  size?: FileUploadSize;
  /** Style: white surface, gray (inside a surface) or flat (soft fill, no dashed border) */
  variant?: FileUploadVariant;
  /** Accepted file types (e.g. image/*). The avatar layout defaults to image/* */
  accept?: string;
  /** Allows selecting multiple files (always off for the avatar layout) */
  multiple?: boolean;
  /** Maximum file size (MB) */
  maxSizeMB?: number;
  /** Maximum number of files; extra files are rejected with a message */
  maxFiles?: number;
  /** Files (controlled) */
  files?: File[];
  /** Called when the file list changes */
  onFilesChange?: (files: File[]) => void;
  /** Upload progress per file name (0–100) */
  progress?: Record<string, number>;
  /** Shows thumbnails for images */
  showPreview?: boolean;
  /** Title (drop zone title, button text or avatar caption) */
  label?: string;
  /** Hint below the title */
  description?: string;
  /** Custom icon instead of the default one */
  icon?: ReactNode;
  /** Disables uploading */
  isDisabled?: boolean;
  /** Adapts to the screen: compact drop zone with a 16px title and 44px remove buttons on mobile, 40px remove buttons on tablet, a taller drop zone on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

interface SizeTokens {
  zone: string;
  zoneR: BreakpointClasses;
  iconBox: string;
  icon: number;
  title: string;
  hint: string;
  row: string;
  item: string;
  thumb: string;
  name: string;
  remove: string;
  avatar: string;
  tile: number;
  radius: string;
  button: "sm" | "md" | "lg";
  gap: string;
}

// Every size scales the same parts: padding, icon, text, list rows, avatar and gallery tiles
const SIZES: Record<FileUploadSize, SizeTokens> = {
  sm: {
    zone: "px-4 py-5 gap-2 rounded-2xl",
    zoneR: {},
    iconBox: "w-9 h-9",
    icon: 16,
    title: "text-[13px]",
    hint: "text-[11px]",
    row: "min-h-12 px-2.5 py-2 gap-2.5 rounded-xl",
    item: "p-2 pr-2.5 gap-2.5 rounded-xl",
    thumb: "w-8 h-8 rounded-lg",
    name: "text-[13px]",
    remove: "w-7 h-7",
    avatar: "w-16 h-16",
    tile: 72,
    radius: "rounded-xl",
    button: "sm",
    gap: "mt-2 space-y-1.5",
  },
  md: {
    zone: "px-6 py-10 gap-3 rounded-3xl",
    zoneR: { m: "mobile:px-4 mobile:py-8 mobile:rounded-2xl", d: "desktop:py-14" },
    iconBox: "w-11 h-11",
    icon: 20,
    title: "text-sm",
    hint: "text-xs",
    row: "min-h-16 px-3 py-2.5 gap-3 rounded-2xl",
    item: "p-2.5 pr-3 gap-3 rounded-2xl",
    thumb: "w-10 h-10 rounded-xl",
    name: "text-sm",
    remove: "w-8 h-8",
    avatar: "w-24 h-24",
    tile: 96,
    radius: "rounded-2xl",
    button: "md",
    gap: "mt-3 space-y-2",
  },
  lg: {
    zone: "px-8 py-14 gap-4 rounded-3xl",
    zoneR: { m: "mobile:px-5 mobile:py-10 mobile:rounded-2xl" },
    iconBox: "w-14 h-14",
    icon: 24,
    title: "text-base",
    hint: "text-sm",
    row: "min-h-20 px-4 py-3 gap-4 rounded-2xl",
    item: "p-3 pr-3.5 gap-3.5 rounded-2xl",
    thumb: "w-12 h-12 rounded-xl",
    name: "text-[15px]",
    remove: "w-9 h-9",
    avatar: "w-32 h-32",
    tile: 128,
    radius: "rounded-2xl",
    button: "lg",
    gap: "mt-3 space-y-2.5",
  },
  xl: {
    zone: "px-10 py-20 gap-5 rounded-[2rem]",
    zoneR: { m: "mobile:px-6 mobile:py-12 mobile:rounded-3xl" },
    iconBox: "w-16 h-16",
    icon: 28,
    title: "text-lg",
    hint: "text-sm",
    row: "min-h-24 px-5 py-4 gap-4 rounded-3xl",
    item: "p-3.5 pr-4 gap-4 rounded-3xl",
    thumb: "w-14 h-14 rounded-2xl",
    name: "text-base",
    remove: "w-10 h-10",
    avatar: "w-40 h-40",
    tile: 160,
    radius: "rounded-3xl",
    button: "lg",
    gap: "mt-4 space-y-3",
  },
};

const titleR: BreakpointClasses = { m: "mobile:text-base" };
const removeR: BreakpointClasses = { m: "mobile:w-11 mobile:h-11 mobile:-mr-1.5", t: "tablet:w-10 tablet:h-10 tablet:-mr-1" };
const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const formatSize = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

function usePreviews(files: File[], enabled: boolean) {
  const previews = useMemo(() => {
    const map = new Map<File, string>();
    if (enabled && typeof URL.createObjectURL === "function") files.forEach((f) => f.type.startsWith("image/") && map.set(f, URL.createObjectURL(f)));
    return map;
  }, [files, enabled]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);
  return previews;
}

export function FileUpload({
  layout = "dropzone",
  size = "md",
  variant = "default",
  accept,
  multiple: multipleProp = true,
  maxSizeMB = 10,
  maxFiles,
  files: filesProp,
  onFilesChange,
  progress,
  showPreview = true,
  label,
  description,
  icon,
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
  const s = SIZES[size];
  const isAvatar = layout === "avatar";
  const multiple = multipleProp && !isAvatar;
  const limit = isAvatar ? 1 : maxFiles;
  const isFull = multiple && limit !== undefined && files.length >= limit;
  const hint = description ?? t.fileUpload.description(maxSizeMB);

  const surface =
    variant === "flat" ? "bg-default" : variant === "secondary" ? "bg-surface-secondary" : "bg-surface";
  const border = variant === "flat" ? "border-2 border-transparent" : "border-2 border-dashed border-border hover:border-accent/50";
  const itemSurface = variant === "default" ? "bg-surface shadow-surface" : surface;

  const update = (next: File[]) => {
    setFilesState(next);
    onFilesChange?.(next);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > maxSizeMB * 1024 ** 2);
    let valid = incoming.filter((f) => f.size <= maxSizeMB * 1024 ** 2);
    let message = tooBig.length ? t.fileUpload.tooLarge(tooBig.map((f) => f.name).join(", "), maxSizeMB) : null;
    if (!multiple) {
      update(valid.slice(0, 1));
    } else {
      const room = limit === undefined ? Infinity : Math.max(0, limit - files.length);
      if (valid.length > room) {
        valid = valid.slice(0, room);
        message = t.fileUpload.tooMany(limit!);
      }
      update([...files, ...valid]);
    }
    setError(message);
  };

  const open = () => !isDisabled && inputRef.current?.click();
  const remove = (i: number) => update(files.filter((_, j) => j !== i));

  // Shared by every layout that can take dropped files
  const dropProps = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (!isDisabled) setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isDisabled) addFiles(e.dataTransfer.files);
    },
  };
  const pressProps = {
    role: "button" as const,
    tabIndex: isDisabled ? -1 : 0,
    "aria-disabled": isDisabled,
    onClick: open,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    },
  };
  const zoneState = cn(
    "transition-colors duration-150",
    focusRing,
    isDragging ? "border-2 border-accent bg-accent-soft" : cn(border, surface),
    isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
  );

  const iconBubble = (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-colors duration-150",
        s.iconBox,
        isDragging ? "bg-accent text-accent-foreground" : "bg-default text-muted group-hover:text-foreground",
        variant === "flat" && !isDragging && "bg-surface"
      )}
    >
      {icon ?? <UploadCloud size={s.icon} />}
    </div>
  );

  const removeButton = (f: File, i: number, extra?: string) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        remove(i);
      }}
      className={cn(
        "flex items-center justify-center rounded-full cursor-pointer shrink-0 transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus",
        extra ?? cn(s.remove, "text-muted hover:bg-danger-soft hover:text-danger", rx(bps, removeR))
      )}
      aria-label={t.fileUpload.remove(f.name)}
    >
      <X size={size === "sm" ? 13 : 15} />
    </button>
  );

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept ?? (isAvatar ? "image/*" : undefined)}
      multiple={multiple}
      disabled={isDisabled}
      hidden
      onChange={(e) => {
        addFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  const fileList = files.length > 0 && (
    <ul className={s.gap}>
      {files.map((f, i) => {
        const preview = previews.get(f);
        const pct = progress?.[f.name];
        const isDone = pct !== undefined && pct >= 100;
        return (
          <li key={`${f.name}-${i}`} className={cn("flex items-center animate-slide-up", s.item, itemSurface)}>
            {preview ? (
              <img src={preview} alt="" className={cn("object-cover shrink-0 bg-default", s.thumb)} />
            ) : (
              <div className={cn("flex items-center justify-center bg-default text-muted shrink-0", s.thumb)}>
                <FileText size={s.icon - 2} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className={cn("truncate font-medium text-foreground", s.name)}>{f.name}</p>
                {isDone && <CheckCircle2 size={14} className="shrink-0 text-success" />}
              </div>
              <p className={cn("text-muted tabular-nums", s.hint)}>
                {formatSize(f.size)}
                {pct !== undefined && !isDone && ` · ${Math.round(pct)}%`}
              </p>
              {pct !== undefined && !isDone && (
                <div className="mt-1.5 h-1 w-full rounded-full bg-default overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-[width] duration-300 ease-(--ease-out-soft)" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
            {removeButton(f, i)}
          </li>
        );
      })}
    </ul>
  );

  const errorText = error && <p className={cn("mt-2 px-1 text-danger animate-fade-in", s.hint)}>{error}</p>;

  if (layout === "avatar") {
    const file = files[0];
    const preview = file && previews.get(file);
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="relative shrink-0">
          <div
            {...pressProps}
            {...dropProps}
            aria-label={label ?? t.fileUpload.choose}
            className={cn(
              "group relative flex items-center justify-center overflow-hidden rounded-full text-muted",
              s.avatar,
              preview ? cn("bg-default", focusRing, isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer") : zoneState
            )}
          >
            {preview ? (
              <>
                <img src={preview} alt="" className="h-full w-full object-cover" />
                <span className={cn("absolute inset-0 flex items-center justify-center bg-black/45 font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100", s.hint)}>
                  {t.fileUpload.change}
                </span>
              </>
            ) : (
              (icon ?? <ImagePlus size={s.icon + 4} className="group-hover:text-foreground transition-colors" />)
            )}
          </div>
          {file && removeButton(file, 0, cn("absolute -right-0.5 -top-0.5", size === "sm" ? "w-6 h-6" : "w-7 h-7", "bg-foreground text-background shadow-surface hover:bg-danger hover:text-white", isDisabled && "hidden"))}
          {input}
        </div>
        <div className="min-w-0">
          <p className={cn("font-medium text-foreground", s.title)}>{label ?? t.fileUpload.choose}</p>
          <p className={cn("mt-0.5 truncate text-muted", s.hint)}>{file ? file.name : hint}</p>
          {errorText}
        </div>
      </div>
    );
  }

  if (layout === "gallery") {
    return (
      <div className={cn("w-full", className)}>
        <ul className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${s.tile}px, 1fr))` }}>
          {files.map((f, i) => {
            const preview = previews.get(f);
            const pct = progress?.[f.name];
            const isLoading = pct !== undefined && pct < 100;
            return (
              <li key={`${f.name}-${i}`} className={cn("group relative aspect-square overflow-hidden animate-slide-up", s.radius, itemSurface)}>
                {preview ? (
                  <img src={preview} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-muted">
                    <FileText size={s.icon} />
                    <span className={cn("w-full truncate text-center text-foreground", s.hint)}>{f.name}</span>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-black/25 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${pct}%` }} />
                  </div>
                )}
                {removeButton(f, i, "absolute right-1.5 top-1.5 w-7 h-7 bg-black/55 text-white backdrop-blur-sm hover:bg-danger")}
              </li>
            );
          })}
          {!isFull && (
            <li className="aspect-square">
              <div
                {...pressProps}
                {...dropProps}
                aria-label={label ?? t.fileUpload.add}
                className={cn("group flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center text-muted", s.radius, zoneState)}
              >
                {icon ?? <Plus size={s.icon} className="group-hover:text-foreground transition-colors" />}
                <span className={cn("font-medium", s.hint)}>{label ?? t.fileUpload.add}</span>
              </div>
            </li>
          )}
        </ul>
        {input}
        {description !== undefined && <p className={cn("mt-2 px-1 text-muted", s.hint)}>{description}</p>}
        {errorText}
      </div>
    );
  }

  if (layout === "button") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Button
            variant={variant === "default" ? "outline" : "secondary"}
            size={s.button}
            isDisabled={isDisabled || isFull}
            startContent={icon ?? <Upload size={s.icon - 4} />}
            onClick={open}
          >
            {label ?? t.fileUpload.choose}
          </Button>
          <span className={cn("text-muted", s.hint)}>{files.length ? t.fileUpload.selected(files.length) : hint}</span>
        </div>
        {input}
        {errorText}
        {fileList}
      </div>
    );
  }

  if (layout === "inline") {
    return (
      <div className={cn("w-full", className)}>
        <div {...pressProps} {...dropProps} className={cn("group flex items-center text-left", s.row, zoneState)}>
          {iconBubble}
          <div className="min-w-0 flex-1">
            <p className={cn("break-words font-medium text-foreground", s.title)}>{label ?? t.fileUpload.label}</p>
            <p className={cn("break-words text-muted", s.hint)}>{hint}</p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full bg-foreground font-medium text-background",
              size === "sm" ? "h-7 px-3 text-xs" : size === "md" ? "h-8 px-3.5 text-sm" : "h-10 px-4 text-sm"
            )}
          >
            {t.fileUpload.browse}
          </span>
          {input}
        </div>
        {errorText}
        {fileList}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        {...pressProps}
        {...dropProps}
        className={cn("group flex flex-col items-center justify-center text-center", s.zone, rx(bps, s.zoneR), zoneState)}
      >
        {iconBubble}
        <div>
          <p className={cn("font-medium text-foreground", s.title, rx(bps, titleR))}>{label ?? t.fileUpload.label}</p>
          <p className={cn("mt-1 text-muted", s.hint)}>{hint}</p>
        </div>
        {input}
      </div>
      {errorText}
      {fileList}
    </div>
  );
}

export default FileUpload;
