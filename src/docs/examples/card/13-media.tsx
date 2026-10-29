import { Card, CardBody, CardHeader, CardMedia, Chip } from "nr-ui-kit";

// CardMedia shapes: video (16:9), square, wide (21:9) and portrait; isInset keeps the padding around it
export default function CardWithMedia() {
  return (
    <div className="grid w-full items-start gap-4 sm:grid-cols-2">
      <Card>
        <CardMedia src="https://picsum.photos/seed/nr-lake/800/450" alt="Mountain lake" />
        <CardHeader title="Video" description="16:9, edge to edge" />
      </Card>
      <Card>
        <CardMedia src="https://picsum.photos/seed/nr-city/600/600" alt="City street" aspect="square" isInset />
        <CardHeader title="Square, inset" description="Keeps the card padding" />
      </Card>
      <Card>
        <CardMedia src="https://picsum.photos/seed/nr-road/900/400" alt="Road" aspect="wide">
          <div className="p-3">
            <Chip size="sm" variant="glass">Travel</Chip>
          </div>
        </CardMedia>
        <CardHeader title="Wide with a badge" description="Content laid over the image" />
      </Card>
      <Card>
        <CardMedia src="https://picsum.photos/seed/nr-forest/600/800" alt="Forest" aspect="portrait" isInset />
        <CardBody className="pt-3 text-muted">Portrait, 3:4 — fits posters and book covers.</CardBody>
      </Card>
    </div>
  );
}
