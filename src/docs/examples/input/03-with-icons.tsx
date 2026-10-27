import { Input } from "nr-ui-kit";
import { AtSign, DollarSign, Globe, Search } from "lucide-react";

export default function InputWithIcons() {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <Input placeholder="Qidirish..." startContent={<Search size={16} />} />
      <Input placeholder="username" startContent={<AtSign size={16} />} />
      <Input
        label="Narx"
        type="number"
        placeholder="0.00"
        startContent={<DollarSign size={16} />}
        endContent={<span className="text-xs font-medium">USD</span>}
      />
      <Input
        label="Sayt"
        placeholder="acme"
        startContent={<Globe size={16} />}
        endContent={<span className="text-sm">.uz</span>}
      />
    </div>
  );
}
