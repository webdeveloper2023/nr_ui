import { Alert } from "nr-ui-kit";

export default function AlertVariants() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <Alert variant="default" color="warning" title="default" description="White surface with a status icon." />
      <Alert variant="soft" color="warning" title="soft" description="A light color tint on the surface." />
      <Alert variant="flat" color="warning" title="flat" description="Fully soft-colored background, no shadow." />
    </div>
  );
}
