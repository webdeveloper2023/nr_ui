import { Divider } from "nr-ui-kit";

export default function DividerVertical() {
  return (
    <div className="flex h-5 items-center justify-center gap-4 text-sm text-muted">
      <a href="#" className="hover:text-foreground">Blog</a>
      <Divider orientation="vertical" />
      <a href="#" className="hover:text-foreground">Docs</a>
      <Divider orientation="vertical" />
      <a href="#" className="hover:text-foreground">Pricing</a>
    </div>
  );
}
