import { Divider } from "nr-ui-kit";

export default function DividerHorizontal() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="text-sm font-medium text-foreground">NR UI</p>
      <p className="text-sm text-muted">A component library for React.</p>
      <Divider className="my-4" />
      <p className="text-sm text-muted">With Tailwind CSS v4, TypeScript and dark mode.</p>
    </div>
  );
}
