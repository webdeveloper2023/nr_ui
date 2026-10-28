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
              Search
            </Button>
            <Button size="sm" variant="ghost" isIconOnly aria-label="Voice">
              <Mic size={15} />
            </Button>
          </>
        }
        footer="AI can make mistakes. Check important info."
      />
      {sent && <p className="mt-3 text-center text-sm text-muted">Sent: "{sent}"</p>}
    </div>
  );
}
