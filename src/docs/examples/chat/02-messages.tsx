import { ChatMessage } from "nr-ui-kit";

export default function ChatMessages() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <ChatMessage role="user" time="14:02">
        Viewport foydalanuvchi pastga tushganda ham joyida qoladimi?
      </ChatMessage>
      <ChatMessage role="assistant" time="14:02">
        Ha — ChatContainer yangi xabar kelganda avtomatik pastga suriladi, javob esa oddiy matn sifatida ko'rsatiladi.
      </ChatMessage>
      <ChatMessage role="assistant" name="NR" isTyping />
    </div>
  );
}
