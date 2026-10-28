const TABBABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "summary",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
].join(",");

/** True when the element (or an ancestor up to `root`) is hidden, inert or display:none / visibility:hidden. */
function isHidden(el: HTMLElement, root: HTMLElement): boolean {
  for (let node: HTMLElement | null = el; node && node !== root; node = node.parentElement) {
    if (node.hidden || node.hasAttribute("inert")) return true;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return true;
  }
  return false;
}

/** Elements inside `root` reachable with Tab, in DOM order (hidden, inert and tabindex="-1" elements are skipped). */
export function getTabbable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.closest("fieldset:disabled") && !isHidden(el, root)
  );
}
