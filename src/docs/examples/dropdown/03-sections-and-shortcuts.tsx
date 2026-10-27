import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "nr-ui-kit";
import { ChevronDown, ClipboardPaste, Copy, FilePlus, Scissors, Trash2 } from "lucide-react";

export default function DropdownSectionsShortcuts() {
  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="tertiary" endContent={<ChevronDown size={16} />}>
            Tahrirlash
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Tahrirlash" className="w-64">
          <DropdownSection title="Fayl" showDivider>
            <DropdownItem itemKey="new" startContent={<FilePlus size={16} />} shortcut="⌘N">
              Yangi fayl
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Bufer" showDivider>
            <DropdownItem itemKey="cut" startContent={<Scissors size={16} />} shortcut="⌘X">
              Kesish
            </DropdownItem>
            <DropdownItem itemKey="copy" startContent={<Copy size={16} />} shortcut="⌘C">
              Nusxalash
            </DropdownItem>
            <DropdownItem itemKey="paste" startContent={<ClipboardPaste size={16} />} shortcut="⌘V" isDisabled>
              Qo'yish
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Xavfli zona">
            <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />} shortcut="⌘⌫">
              O'chirish
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
