import { Chip } from "nr-ui-kit";

export default function ChipGlass() {
  return (
    <div className="relative flex w-full flex-wrap items-center justify-center gap-2 overflow-hidden rounded-3xl px-6 py-12">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Chip variant="glass" className="relative">Default</Chip>
      <Chip variant="glass" color="accent" dot className="relative">Accent</Chip>
      <Chip variant="glass" color="success" dot className="relative">Online</Chip>
      <Chip variant="glass" color="warning" className="relative">Pending</Chip>
      <Chip variant="glass" color="danger" className="relative">Error</Chip>
    </div>
  );
}
