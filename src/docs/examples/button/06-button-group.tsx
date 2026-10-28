import { Button, ButtonGroup } from "nr-ui-kit";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";

export default function ButtonGroupExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <ButtonGroup>
        <Button isIconOnly aria-label="Bold"><Bold size={16} /></Button>
        <Button isIconOnly aria-label="Italic"><Italic size={16} /></Button>
        <Button isIconOnly aria-label="Underline"><Underline size={16} /></Button>
      </ButtonGroup>
      <ButtonGroup variant="outline">
        <Button isIconOnly aria-label="Align left"><AlignLeft size={16} /></Button>
        <Button isIconOnly aria-label="Align center"><AlignCenter size={16} /></Button>
        <Button isIconOnly aria-label="Align right"><AlignRight size={16} /></Button>
      </ButtonGroup>
      <ButtonGroup variant="primary">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    </div>
  );
}
