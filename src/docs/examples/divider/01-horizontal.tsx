import { Divider } from "nr-ui-kit";

export default function DividerHorizontal() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="text-sm font-medium text-foreground">NR UI</p>
      <p className="text-sm text-muted">React uchun komponentlar kutubxonasi.</p>
      <Divider className="my-4" />
      <p className="text-sm text-muted">Tailwind CSS v4, TypeScript va dark mode bilan.</p>
    </div>
  );
}
