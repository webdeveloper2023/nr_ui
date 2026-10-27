import { Button, ButtonGroup } from "nr-ui-kit";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";

export default function ButtonGroupExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <ButtonGroup>
        <Button isIconOnly aria-label="Qalin"><Bold size={16} /></Button>
        <Button isIconOnly aria-label="Kursiv"><Italic size={16} /></Button>
        <Button isIconOnly aria-label="Tagi chizilgan"><Underline size={16} /></Button>
      </ButtonGroup>
      <ButtonGroup variant="outline">
        <Button isIconOnly aria-label="Chapga"><AlignLeft size={16} /></Button>
        <Button isIconOnly aria-label="Markazga"><AlignCenter size={16} /></Button>
        <Button isIconOnly aria-label="O'ngga"><AlignRight size={16} /></Button>
      </ButtonGroup>
      <ButtonGroup variant="primary">
        <Button>Kun</Button>
        <Button>Hafta</Button>
        <Button>Oy</Button>
      </ButtonGroup>
    </div>
  );
}
