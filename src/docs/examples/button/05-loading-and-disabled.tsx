import { useState } from "react";
import { Button } from "nr-ui-kit";
import { Send } from "lucide-react";

export default function ButtonLoadingAndDisabled() {
  const [isLoading, setIsLoading] = useState(false);

  const send = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button isLoading={isLoading} onClick={send} startContent={<Send size={16} />}>
        {isLoading ? "Yuborilmoqda" : "Yuborish"}
      </Button>
      <Button variant="secondary" isLoading>
        Yuklanmoqda
      </Button>
      <Button variant="tertiary" isDisabled>
        O'chirilgan
      </Button>
    </div>
  );
}
