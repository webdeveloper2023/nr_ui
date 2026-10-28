import { ChatMessage } from "nr-ui-kit";

export default function ChatMessages() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <ChatMessage role="user" time="14:02">
        Does the view stay in place when the user scrolls down?
      </ChatMessage>
      <ChatMessage role="assistant" time="14:02">
        Yes — ChatContainer scrolls to the bottom automatically when a new message arrives, and replies render as plain text.
      </ChatMessage>
      <ChatMessage role="assistant" name="NR" isTyping />
    </div>
  );
}
