import { useState } from "react";
import { Globe, Mic } from "lucide-react";
import { Button, PromptInput } from "nr-ui-kit";

export default function ChatPromptInput() {
  const [sent, setSent] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-xl">
      <PromptInput
        onSubmit={setSent}
        onAttach={() => {}}
        startContent={
          <>
            <Button size="sm" variant="ghost" startContent={<Globe size={15} />}>
              Qidiruv
            </Button>
            <Button size="sm" variant="ghost" isIconOnly aria-label="Ovoz">
              <Mic size={15} />
            </Button>
          </>
        }
        footer="AI xato qilishi mumkin. Muhim ma'lumotlarni tekshiring."
      />
      {sent && <p className="mt-3 text-center text-sm text-muted">Yuborildi: "{sent}"</p>}
    </div>
  );
}
