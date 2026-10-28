import { Button, Tooltip } from "nr-ui-kit";

export default function TooltipGlassAndSolid() {
  return (
    <div className="relative overflow-hidden rounded-3xl px-8 py-16">
      <div className="absolute left-6 top-4 size-48 rounded-full bg-pink blur-2xl opacity-70" />
      <div className="absolute right-10 top-4 size-48 rounded-full bg-cyan blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-40 rounded-full bg-green blur-2xl opacity-50" />
      <div className="relative flex flex-wrap justify-center gap-4">
        <Tooltip content="Glass tooltip (default)" showArrow>
          <Button variant="secondary">Glass</Button>
        </Tooltip>
        <Tooltip content="Solid tooltip" showArrow isBlurred={false}>
          <Button variant="secondary">Solid</Button>
        </Tooltip>
        <Tooltip content="Colored tooltips are always solid" color="accent" showArrow>
          <Button variant="secondary">Accent</Button>
        </Tooltip>
      </div>
    </div>
  );
}
