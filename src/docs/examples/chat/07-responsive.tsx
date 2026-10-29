import { ChatContainer, ChatMessage, PromptInput } from "nr-ui-kit";

// Resize the window: on mobile the bubbles widen, the prompt text is 16px and the send button is 44px.
export default function ChatResponsive() {
  return (
    <div className="flex h-[460px] flex-col overflow-hidden rounded-3xl bg-background">
      <ChatContainer responsive>
        <ChatMessage role="user">How do I make the chat fit a phone?</ChatMessage>
        <ChatMessage role="assistant" name="AI" showActions>
          Add responsive to ChatContainer — the messages inside inherit it.
        </ChatMessage>
      </ChatContainer>
      <div className="p-3">
        <PromptInput responsive suggestions={["Show an example", "Which breakpoints?"]} />
      </div>
    </div>
  );
}
