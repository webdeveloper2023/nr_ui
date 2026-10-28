import { PromptInput } from "nr-ui-kit";

export default function ChatSuggestionsAndDisabled() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <PromptInput suggestions={["Build a dashboard", "Change the color", "Add dark mode"]} minRows={1} />
      <PromptInput isDisabled placeholder="Limit reached — try again tomorrow" minRows={1} />
    </div>
  );
}
