import { PromptInput } from "nr-ui-kit";

export default function ChatLiquidGlass() {
  return (
    <div className="relative grid w-full gap-6 overflow-hidden rounded-3xl p-6 sm:p-10">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">frosted</p>
        <PromptInput isBlurred material="frosted" minRows={1} placeholder="Xabar yozing..." />
      </div>
      <div className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">liquid</p>
        <PromptInput isBlurred material="liquid" minRows={1} placeholder="Liquid kompozer..." />
      </div>
    </div>
  );
}
