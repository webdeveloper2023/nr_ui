import { useState } from "react";
import { Tabs } from "../components";
import { SkeletonScope, skeletonAttrs } from "../components/skeletonState";
import { CodeBlock } from "./CodeBlock";
import type { Example } from "./modules";
import { useT } from "./i18n/lang";

/**
 * One live example with its code. The control in the corner shows the same example in the
 * skeleton state; `skeleton` from the page switches every example at once.
 */
export function ExampleBlock({ example, skeleton = false }: { example: Example; skeleton?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState(skeleton ? "skeleton" : "preview");
  const t = useT();
  const { Component } = example;
  const long = example.code.split("\n").length > 6;
  const isSkeleton = view === "skeleton";

  return (
    <div id={example.id} className="scroll-mt-28">
      <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground">{example.title}</h3>
      <div className="overflow-hidden rounded-3xl border border-border bg-background">
        <div className="relative flex min-h-[260px] items-center justify-center px-6 pt-16 pb-12 sm:px-10">
          <div className="absolute right-3 top-3">
            <Tabs
              size="xs"
              aria-label={t({ en: "Example view", uz: "Misol ko'rinishi", ru: "Вид примера" })}
              selectedKey={view}
              onSelectionChange={setView}
              tabs={[
                { key: "preview", title: t({ en: "Preview", uz: "Ko'rinish", ru: "Просмотр" }) },
                { key: "skeleton", title: "Skeleton" },
              ]}
            />
          </div>
          <div className="w-full max-w-full" {...skeletonAttrs(isSkeleton)}>
            <SkeletonScope on={isSkeleton}>
              <Component />
            </SkeletonScope>
          </div>
        </div>
        <div className="relative border-t border-border" style={{ ["--nr-code-bg" as string]: "var(--color-background)" }}>
          <CodeBlock code={example.code} bare collapsedHeight={!expanded && long ? 132 : undefined} maxHeight={expanded ? 640 : undefined} />
          {long && (
            <div className={expanded ? "flex justify-center pb-4" : "absolute inset-x-0 bottom-3 flex justify-center"}>
              <button
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                className="h-8 rounded-full bg-overlay px-3.5 text-xs font-medium text-foreground shadow-overlay transition-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                {expanded ? t({ en: "Hide code", uz: "Kodni yashirish", ru: "Скрыть код" }) : t({ en: "Show code", uz: "Kodni ko'rsatish", ru: "Показать код" })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExampleBlock;
