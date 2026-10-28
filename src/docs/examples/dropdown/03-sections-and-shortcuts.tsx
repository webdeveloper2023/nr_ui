import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "nr-ui-kit";
import { ChevronDown, ClipboardPaste, Copy, FilePlus, Scissors, Trash2 } from "lucide-react";

export default function DropdownSectionsShortcuts() {
  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="tertiary" endContent={<ChevronDown size={16} />}>
            Edit
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Edit" className="w-64">
          <DropdownSection title="File" showDivider>
            <DropdownItem itemKey="new" startContent={<FilePlus size={16} />} shortcut="⌘N">
              New file
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Clipboard" showDivider>
            <DropdownItem itemKey="cut" startContent={<Scissors size={16} />} shortcut="⌘X">
              Cut
            </DropdownItem>
            <DropdownItem itemKey="copy" startContent={<Copy size={16} />} shortcut="⌘C">
              Copy
            </DropdownItem>
            <DropdownItem itemKey="paste" startContent={<ClipboardPaste size={16} />} shortcut="⌘V" isDisabled>
              Paste
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />} shortcut="⌘⌫">
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
