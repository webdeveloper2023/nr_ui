// theme.css adds exact-range variants for your own markup:
// mobile: (<768) · tablet: (768–1023) · laptop: (1024–1535) · desktop: (≥1536)
export default function TailwindVariants() {
  return (
    <div className="w-full rounded-2xl bg-surface-secondary p-4 text-sm mobile:bg-accent-soft tablet:bg-success-soft desktop:bg-warning-soft">
      <span className="font-medium">
        <span className="hidden mobile:inline">mobile:</span>
        <span className="hidden tablet:inline">tablet:</span>
        <span className="hidden laptop:inline">laptop:</span>
        <span className="hidden desktop:inline">desktop:</span>
      </span>{" "}
      this box changes color on every breakpoint.
    </div>
  );
}
