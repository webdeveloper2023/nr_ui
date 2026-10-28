import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUp, Plus, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Square } from "lucide-react";
import { Avatar } from "./Avatar";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";

const actionBtn = cn(
  "flex items-center justify-center w-7 h-7 rounded-full text-muted cursor-pointer",
  "hover:bg-default hover:text-foreground transition-colors duration-150",
  "outline-none focus-visible:ring-2 focus-visible:ring-focus"
);

export interface ChatContainerProps {
  /** Chat messages */
  children?: ReactNode;
  /** Extra CSS classes */
  className?: string;
}

/** Scrollable message list that sticks to the bottom as messages arrive. */
export function ChatContainer({ children, className = "" }: ChatContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [children]);

  return (
    <div ref={ref} className={cn("flex-1 overflow-y-auto px-5 py-6 space-y-6", className)} role="log" aria-live="polite">
      {children}
    </div>
  );
}

export interface ChatMessageProps {
  /** Message author: user or assistant */
  role: "user" | "assistant";
  /** Author name (used as initials on the assistant avatar) */
  name?: string;
  /** Assistant avatar image URL */
  avatar?: string;
  /** Message time */
  time?: string;
  /** Shows the typing indicator */
  isTyping?: boolean;
  /** Shows the copy / like / dislike actions */
  showActions?: boolean;
  /** Called when copy is pressed */
  onCopy?: () => void;
  /** Called when regenerate is pressed */
  onRegenerate?: () => void;
  /** Called when like or dislike is pressed */
  onFeedback?: (value: "like" | "dislike") => void;
  /** Inner content */
  children?: ReactNode;
}

export function ChatMessage({
  role,
  name,
  avatar,
  time,
  isTyping,
  showActions = true,
  onCopy,
  onRegenerate,
  onFeedback,
  children,
}: ChatMessageProps) {
  const t = useLocale();
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const copy = () => {
    if (typeof children === "string") navigator.clipboard?.writeText(children).catch(() => {});
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rate = (v: "like" | "dislike") => {
    setFeedback(v);
    onFeedback?.(v);
  };

  if (isUser) {
    return (
      <div className="flex flex-col items-end animate-slide-up">
        <div className="max-w-[80%] rounded-[20px] rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-foreground break-words">{children}</div>
        {time && <span className="mt-1 px-2 text-xs text-muted">{time}</span>}
      </div>
    );
  }

  return (
    <div className="group flex gap-3 animate-slide-up">
      {avatar ? (
        <Avatar src={avatar} name={name ?? "AI"} size="sm" />
      ) : (
        <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-default text-xs font-semibold text-foreground">
          {(name ?? "AI").slice(0, 2)}
        </span>
      )}
      <div className="min-w-0 flex-1 pt-1">
        {time && <p className="mb-1 text-xs text-muted">{time}</p>}
        <div className="w-fit max-w-full rounded-[20px] rounded-bl-md bg-default px-4 py-2.5 text-sm leading-relaxed text-foreground break-words">
          {isTyping ? (
            <span className="flex items-center gap-1 h-6" aria-label={t.chat.typing}>
              {[0, 150, 300].map((d) => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
          ) : (
            children
          )}
        </div>
        {!isTyping && showActions && (
          <div className="mt-2 -ml-1.5 flex items-center gap-0.5">
            <button className={actionBtn} onClick={copy} aria-label={t.chat.copy}>
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
            {onRegenerate && (
              <button className={actionBtn} onClick={onRegenerate} aria-label={t.chat.regenerate}>
                <RotateCcw size={14} />
              </button>
            )}
            <button className={cn(actionBtn, feedback === "like" && "text-foreground")} onClick={() => rate("like")} aria-label={t.chat.like}>
              <ThumbsUp size={14} className={feedback === "like" ? "fill-current" : undefined} />
            </button>
            <button className={cn(actionBtn, feedback === "dislike" && "text-foreground")} onClick={() => rate("dislike")} aria-label={t.chat.dislike}>
              <ThumbsDown size={14} className={feedback === "dislike" ? "fill-current" : undefined} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface PromptInputProps {
  /** Input value (controlled) */
  value?: string;
  /** Called with the new value when it changes */
  onValueChange?: (value: string) => void;
  /** Called when a message is sent (Enter) */
  onSubmit?: (value: string) => void;
  /** Called when the stop button is pressed */
  onStop?: () => void;
  /** Called when the attach button is pressed (shown only when set) */
  onAttach?: () => void;
  /** Waiting for a reply — shows a stop button instead of send */
  isLoading?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Placeholder shown in the empty input */
  placeholder?: string;
  /** Quick suggestion prompts */
  suggestions?: string[];
  /** Minimum rows */
  minRows?: number;
  /** Maximum rows */
  maxRows?: number;
  /** Extra buttons on the left of the bottom row */
  startContent?: ReactNode;
  /** Helper text below the input */
  footer?: ReactNode;
  /** Makes the composer glass — floating over the content */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Extra CSS classes */
  className?: string;
}

export function PromptInput({
  value: valueProp,
  onValueChange,
  onSubmit,
  onStop,
  onAttach,
  isLoading = false,
  isDisabled = false,
  placeholder,
  suggestions,
  minRows = 2,
  maxRows = 8,
  startContent,
  footer,
  isBlurred = false,
  material,
  className = "",
}: PromptInputProps) {
  const t = useLocale();
  const [valueState, setValueState] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const value = valueProp ?? valueState;
  const canSend = Boolean(value.trim()) && !isDisabled;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, minRows * 24), maxRows * 24)}px`;
  }, [value, minRows, maxRows]);

  const setValue = (v: string) => {
    setValueState(v);
    onValueChange?.(v);
  };

  const submit = () => {
    if (!canSend || isLoading) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {suggestions && suggestions.length > 0 && !value && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                ref.current?.focus();
              }}
              className={cn(
                "h-8 rounded-full bg-surface px-3.5 text-sm text-foreground shadow-surface cursor-pointer",
                "hover:bg-default transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-focus"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div
        data-glass={material}
        onClick={() => ref.current?.focus()}
        className={cn(
          "flex flex-col gap-2 rounded-3xl p-3 cursor-text",
          isBlurred ? "glass" : "bg-field shadow-field",
          "outline-1 outline-transparent transition-[outline-color] duration-150 focus-within:outline-border",
          isDisabled && "opacity-50 pointer-events-none"
        )}
      >
        <textarea
          ref={ref}
          rows={minRows}
          value={value}
          disabled={isDisabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? t.chat.placeholder}
          className="w-full resize-none bg-transparent px-1 text-sm leading-6 text-foreground placeholder:text-field-placeholder outline-none"
        />
        <div className="flex items-center gap-1">
          {onAttach && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAttach();
              }}
              className={cn(actionBtn, "w-8 h-8")}
              aria-label={t.chat.attach}
            >
              <Plus size={17} />
            </button>
          )}
          {startContent}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoading) onStop?.();
              else submit();
            }}
            disabled={!isLoading && !canSend}
            className={cn(
              "ml-auto flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-accent text-accent-foreground",
              "transition-[opacity,transform] duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isLoading || canSend ? "hover:bg-accent-hover active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed"
            )}
            aria-label={isLoading ? t.chat.stop : t.chat.send}
          >
            {isLoading ? <Square size={12} fill="currentColor" /> : <ArrowUp size={17} />}
          </button>
        </div>
      </div>
      {footer && <div className="mt-2 px-3 text-center text-xs text-muted">{footer}</div>}
    </div>
  );
}
