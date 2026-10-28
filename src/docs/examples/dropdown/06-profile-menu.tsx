import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "nr-ui-kit";
import { CreditCard, HelpCircle, LogOut, Settings, User } from "lucide-react";

export default function DropdownProfileMenu() {
  return (
    <div className="flex justify-center">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Avatar src="https://i.pravatar.cc/150?u=rafiqjon" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile" className="w-60">
          <DropdownSection showDivider>
            <DropdownItem itemKey="profile" className="h-14" description="rafiqjon@acme.uz">
              Rafiqjon Nazirov
            </DropdownItem>
          </DropdownSection>
          <DropdownSection showDivider>
            <DropdownItem itemKey="account" startContent={<User size={16} />}>
              Profile
            </DropdownItem>
            <DropdownItem itemKey="billing" startContent={<CreditCard size={16} />}>
              Billing
            </DropdownItem>
            <DropdownItem itemKey="settings" startContent={<Settings size={16} />} shortcut="⌘,">
              Settings
            </DropdownItem>
            <DropdownItem itemKey="help" startContent={<HelpCircle size={16} />}>
              Help
            </DropdownItem>
          </DropdownSection>
          <DropdownItem itemKey="logout" color="danger" startContent={<LogOut size={16} />}>
            Log out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
