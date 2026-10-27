import { PromptInput } from "nr-ui-kit";

export default function ChatSuggestionsAndDisabled() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <PromptInput suggestions={["Dashboard yarat", "Rangni o'zgartir", "Dark mode qo'sh"]} minRows={1} />
      <PromptInput isDisabled placeholder="Limit tugadi — ertaga qayta urinib ko'ring" minRows={1} />
    </div>
  );
}
