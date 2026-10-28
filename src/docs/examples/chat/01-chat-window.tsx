import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ChatContainer, ChatMessage, PromptInput } from "nr-ui-kit";

type Message = { role: "user" | "assistant"; text: string };

export default function ChatWindow() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", text: "Which components do I need for a dashboard?" },
    { role: "assistant", text: "Sidebar, StatCard (KPIs), Table and Pagination are enough. Add a Navbar on top and it looks like a complete app." },
  ]);

  const send = (text: string) => {
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: `"${text}" — great question! This is a demo reply; in a real app it comes from your API.` }]);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="mx-auto flex h-[540px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface shadow-surface">
      <div className="flex h-14 items-center gap-2 border-b border-separator px-5">
        <Sparkles size={16} className="text-accent" />
        <span className="text-sm font-medium text-foreground">NR Assistant</span>
      </div>
      <ChatContainer>
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} onRegenerate={m.role === "assistant" ? () => send("Rewrite that") : undefined}>
            {m.text}
          </ChatMessage>
        ))}
        {loading && <ChatMessage role="assistant" isTyping />}
      </ChatContainer>
      <div className="p-3">
        <PromptInput onSubmit={send} isLoading={loading} onStop={() => setLoading(false)} onAttach={() => {}} minRows={1} />
      </div>
    </div>
  );
}
