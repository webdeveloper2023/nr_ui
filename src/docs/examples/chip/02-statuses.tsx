import { AlertTriangle, Ban, Check, Info } from "lucide-react";
import { Chip } from "nr-ui-kit";

export default function ChipStatuses() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Chip variant="primary" dot>Default</Chip>
        <Chip variant="primary" color="success" dot>Faol</Chip>
        <Chip variant="primary" color="warning" dot>Kutilmoqda</Chip>
        <Chip variant="primary" color="danger" dot>Nofaol</Chip>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Chip startContent={<Info />}>Yangi imkoniyat</Chip>
        <Chip color="success" startContent={<Check />}>Mavjud</Chip>
        <Chip color="warning" startContent={<AlertTriangle />}>Beta</Chip>
        <Chip color="danger" startContent={<Ban />}>Eskirgan</Chip>
      </div>
    </div>
  );
}
