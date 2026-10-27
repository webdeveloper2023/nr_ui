import { Alert } from "nr-ui-kit";

export default function AlertVariants() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <Alert variant="default" color="warning" title="default" description="Oq surface va holat ikonkasi." />
      <Alert variant="soft" color="warning" title="soft" description="Surface ustida yengil rangli tus." />
      <Alert variant="flat" color="warning" title="flat" description="To'liq yumshoq rangli fon, soyasiz." />
    </div>
  );
}
