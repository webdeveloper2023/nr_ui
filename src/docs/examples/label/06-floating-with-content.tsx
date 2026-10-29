import { AmountInput, Input, PhoneInput } from "nr-ui-kit";
import { Search } from "lucide-react";

// Floating labels work with icons, masks and the money field too.
export default function FloatingWithContent() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Input label="Search orders" labelPlacement="floating" startContent={<Search size={16} />} isClearable />
      <PhoneInput label="Phone" labelPlacement="floating" country="UZ" />
      <AmountInput label="Amount" labelPlacement="floating" wordsLocale="en" />
      <Input label="Card number" labelPlacement="floating" size="lg" isInvalid errorMessage="Check the card number" defaultValue="4111 1111" />
    </div>
  );
}
