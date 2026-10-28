import { useState } from "react";
import { ChatContainer, ChatMessage, PromptInput } from "nr-ui-kit";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatGlassComposer() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "user", text: "What's the weather like today?" },
    { role: "assistant", text: "Sunny in Tashkent, +24°C. It will get a bit cooler in the evening." },
  ]);

  const send = (text: string) => {
    setMessages((m) => [...m, { role: "user", text }]);
    setTimeout(() => setMessages((m) => [...m, { role: "assistant", text: "Got it! This is a demo reply." }]), 700);
  };

  return (
    <div className="relative flex h-[440px] w-full flex-col overflow-hidden rounded-3xl">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <ChatContainer className="relative">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} name={m.role === "assistant" ? "Assistant" : undefined}>
            {m.text}
          </ChatMessage>
        ))}
      </ChatContainer>
      <div className="relative p-3">
        <PromptInput isBlurred minRows={1} onSubmit={send} placeholder="Type a message..." />
      </div>
    </div>
  );
}
