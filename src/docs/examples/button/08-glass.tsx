import { Heart, Plus, Share2 } from "lucide-react";
import { Button } from "nr-ui-kit";

export default function ButtonGlass() {
  return (
    <div className="relative flex w-full flex-wrap items-center justify-center gap-3 overflow-hidden rounded-3xl px-6 py-14">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <Button variant="glass" className="relative">Glass</Button>
      <Button variant="glass" className="relative" startContent={<Plus size={16} />}>Add</Button>
      <Button variant="glass" className="relative" isIconOnly aria-label="Like"><Heart size={18} /></Button>
      <Button variant="glass" className="relative" isIconOnly aria-label="Share"><Share2 size={18} /></Button>
      <Button variant="glass" size="lg" className="relative">Large glass</Button>
    </div>
  );
}
