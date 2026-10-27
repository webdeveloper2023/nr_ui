import { useMemo, useState } from "react";
import { highlight } from "sugar-high";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/cn";

export interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  /** Show line numbers (default for multi-line code). */
  lineNumbers?: boolean;
  /** Collapse to this height with a fade; the parent controls expanding. */
  collapsedHeight?: number;
  maxHeight?: number;
  /** Render without own background/radius (when embedded in another surface). */
  bare?: boolean;
  className?: string;
}

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button
      onClick={copy}
      aria-label="Copy code"
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors",
        copied ? "text-success" : "text-muted hover:bg-default hover:text-foreground",
        className
      )}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function CodeBlock({
  code,
  language = "tsx",
  fileName,
  lineNumbers,
  collapsedHeight,
  maxHeight,
  bare = false,
  className = "",
}: CodeBlockProps) {
  const lines = useMemo(() => {
    const plain = language === "bash" || language === "css";
    const html = plain ? escapeHtml(code) : highlight(code);
    // sugar-high wraps each line in <span class="sh__line">; split for numbering
    return plain ? html.split("\n") : html.split("\n").map((l) => l);
  }, [code, language]);
  const numbered = lineNumbers ?? lines.length > 3;

  return (
    <div className={cn("nr-code group relative", !bare && "rounded-2xl bg-surface-secondary", className)}>
      {fileName && (
        <div className="flex items-center h-10 px-4 border-b border-separator text-xs font-medium text-muted font-mono">{fileName}</div>
      )}
      <CopyButton text={code} className={cn("absolute right-2.5 z-10", fileName ? "top-1" : "top-2.5")} />
      <div
        className="relative overflow-hidden"
        style={{ maxHeight: collapsedHeight ?? undefined }}
      >
        <pre className="overflow-auto py-4 pr-12 text-[13px] leading-[1.6rem] font-mono" style={{ maxHeight }}>
          <code className="grid">
            {lines.map((html, i) => (
              <span key={i} className="flex">
                {numbered && <span className="sticky left-0 w-10 shrink-0 pr-4 text-right select-none text-muted/50">{i + 1}</span>}
                <span className={cn("whitespace-pre", !numbered && "pl-5")} dangerouslySetInnerHTML={{ __html: html || " " }} />
              </span>
            ))}
          </code>
        </pre>
        {collapsedHeight && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--nr-code-bg)] to-transparent" />}
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default CodeBlock;
