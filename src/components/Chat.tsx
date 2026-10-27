import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUp, Plus, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Square } from "lucide-react";
import { Avatar } from "./Avatar";
import { cn } from "../lib/cn";

const actionBtn = cn(
  "flex items-center justify-center w-7 h-7 rounded-full text-muted cursor-pointer",
  "hover:bg-default hover:text-foreground transition-colors duration-150",
  "outline-none focus-visible:ring-2 focus-visible:ring-focus"
);

export interface ChatContainerProps {
  /** Chat xabarlari */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
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
  /** Xabar muallifi: foydalanuvchi yoki assistent */
  role: "user" | "assistant";
  /** Muallif ismi (assistent avatarida initsial sifatida) */
  name?: string;
  /** Assistent avatari rasmi URL manzili */
  avatar?: string;
  /** Xabar vaqti */
  time?: string;
  /** Yozilmoqda (typing) indikatorini ko'rsatadi */
  isTyping?: boolean;
  /** Copy/like/dislike amallarini ko'rsatadi */
  showActions?: boolean;
  /** Nusxa olish bosilganda chaqiriladi */
  onCopy?: () => void;
  /** Qayta yaratish bosilganda chaqiriladi */
  onRegenerate?: () => void;
  /** Like yoki dislike bosilganda chaqiriladi */
  onFeedback?: (value: "like" | "dislike") => void;
  /** Ichki kontent */
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
        <div className="max-w-[80%] rounded-3xl bg-default px-4 py-2.5 text-sm leading-relaxed text-foreground break-words">{children}</div>
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
        <div className="text-sm leading-relaxed text-foreground break-words">
          {isTyping ? (
            <span className="flex items-center gap-1 h-6" aria-label="Typing">
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
            <button className={actionBtn} onClick={copy} aria-label="Copy">
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
            {onRegenerate && (
              <button className={actionBtn} onClick={onRegenerate} aria-label="Regenerate">
                <RotateCcw size={14} />
              </button>
            )}
            <button className={cn(actionBtn, feedback === "like" && "text-foreground")} onClick={() => rate("like")} aria-label="Like">
              <ThumbsUp size={14} className={feedback === "like" ? "fill-current" : undefined} />
            </button>
            <button className={cn(actionBtn, feedback === "dislike" && "text-foreground")} onClick={() => rate("dislike")} aria-label="Dislike">
              <ThumbsDown size={14} className={feedback === "dislike" ? "fill-current" : undefined} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface PromptInputProps {
  /** Input qiymati (boshqariladigan) */
  value?: string;
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (value: string) => void;
  /** Xabar yuborilganda (Enter) chaqiriladi */
  onSubmit?: (value: string) => void;
  /** Javobni to'xtatish tugmasi bosilganda */
  onStop?: () => void;
  /** Fayl biriktirish tugmasi bosilganda (berilsa ko'rinadi) */
  onAttach?: () => void;
  /** Javob kutilmoqda — yuborish o'rniga stop tugmasi */
  isLoading?: boolean;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Bo'sh inputdagi matn */
  placeholder?: string;
  /** Tezkor tayyor so'rovlar ro'yxati */
  suggestions?: string[];
  /** Minimal qatorlar soni */
  minRows?: number;
  /** Maksimal qatorlar soni */
  maxRows?: number;
  /** Pastki qator chap tomonidagi qo'shimcha tugmalar */
  startContent?: ReactNode;
  /** Input ostidagi izoh matni */
  footer?: ReactNode;
  /** Qo'shimcha CSS klasslar */
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
  placeholder = "Nimani bilmoqchisiz?",
  suggestions,
  minRows = 2,
  maxRows = 8,
  startContent,
  footer,
  className = "",
}: PromptInputProps) {
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
        onClick={() => ref.current?.focus()}
        className={cn(
          "flex flex-col gap-2 rounded-3xl bg-field p-3 shadow-field cursor-text",
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
          placeholder={placeholder}
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
              aria-label="Attach"
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
            aria-label={isLoading ? "Stop" : "Send"}
          >
            {isLoading ? <Square size={12} fill="currentColor" /> : <ArrowUp size={17} />}
          </button>
        </div>
      </div>
      {footer && <div className="mt-2 px-3 text-center text-xs text-muted">{footer}</div>}
    </div>
  );
}
