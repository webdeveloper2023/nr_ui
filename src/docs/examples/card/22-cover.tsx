import { ArrowRight } from "lucide-react";
import { Button, Card, CardMedia } from "nr-ui-kit";

// Full-bleed cover: the text sits on a dark gradient laid over the media
export default function CardCover() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      <Card size="xl" isHoverable className="md:col-span-2">
        <CardMedia src="https://picsum.photos/seed/nr-coast/1200/700" alt="Coast at sunset" aspect="video" className="h-full">
          <div className="mt-auto bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 text-white sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">Guide</p>
            <p className="mt-1 text-2xl font-semibold">Ten quiet places for a weekend trip</p>
            <Button className="mt-4" variant="glass" endContent={<ArrowRight size={15} />}>Read</Button>
          </div>
        </CardMedia>
      </Card>
      <Card size="xl" isHoverable>
        <CardMedia src="https://picsum.photos/seed/nr-peak/600/800" alt="Mountain peak" aspect="portrait" className="h-full">
          <div className="mt-auto bg-gradient-to-t from-black/75 to-transparent p-6 text-white">
            <p className="text-lg font-semibold">Hiking basics</p>
            <p className="text-sm text-white/75">8 min read</p>
          </div>
        </CardMedia>
      </Card>
    </div>
  );
}
