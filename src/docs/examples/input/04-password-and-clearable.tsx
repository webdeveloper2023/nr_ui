import { useState } from "react";
import { Input } from "nr-ui-kit";
import { Eye, EyeOff, Lock, Search } from "lucide-react";

export default function InputPasswordAndClearable() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mx-auto grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <Input
        label="Parol"
        type={visible ? "text" : "password"}
        defaultValue="supersecret"
        startContent={<Lock size={16} />}
        endContent={
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Yashirish" : "Ko'rsatish"}
            className="cursor-pointer hover:text-foreground"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
      <Input label="Qidiruv" defaultValue="NR UI" isClearable startContent={<Search size={16} />} />
    </div>
  );
}
