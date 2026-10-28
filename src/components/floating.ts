import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

/* Shared positioning / presence helpers for Tooltip, Popover, Dropdown. Internal. */

export type Placement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

type Side = "top" | "bottom" | "left" | "right";

const opposite: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

export const getSide = (p: Placement): Side => p.split("-")[0] as Side;

function coords(t: DOMRect, f: DOMRect, placement: Placement, offset: number) {
  const [side, align] = placement.split("-") as [Side, "start" | "end" | undefined];
  let top = 0;
  let left = 0;
  if (side === "top" || side === "bottom") {
    top = side === "top" ? t.top - f.height - offset : t.bottom + offset;
    left = align === "start" ? t.left : align === "end" ? t.right - f.width : t.left + t.width / 2 - f.width / 2;
  } else {
    left = side === "left" ? t.left - f.width - offset : t.right + offset;
    top = align === "start" ? t.top : align === "end" ? t.bottom - f.height : t.top + t.height / 2 - f.height / 2;
  }
  return { top, left };
}

const PAD = 8;

export function computePosition(t: DOMRect, f: DOMRect, placement: Placement, offset = 8) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let finalPlacement = placement;
  let { top, left } = coords(t, f, placement, offset);

  const side = getSide(placement);
  const overflows =
    (side === "top" && top < PAD) ||
    (side === "bottom" && top + f.height > vh - PAD) ||
    (side === "left" && left < PAD) ||
    (side === "right" && left + f.width > vw - PAD);

  if (overflows) {
    const flipped = placement.replace(side, opposite[side]) as Placement;
    const alt = coords(t, f, flipped, offset);
    const fits =
      alt.top >= PAD && alt.top + f.height <= vh - PAD && alt.left >= PAD && alt.left + f.width <= vw - PAD;
    if (fits) {
      finalPlacement = flipped;
      ({ top, left } = alt);
    }
  }

  left = Math.min(Math.max(left, PAD), Math.max(PAD, vw - f.width - PAD));
  top = Math.min(Math.max(top, PAD), Math.max(PAD, vh - f.height - PAD));
  return { top, left, placement: finalPlacement };
}

/** Mount → visible two-phase presence so elements animate in AND out. */
export function usePresence(isOpen: boolean, duration = 150) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration]);

  return { mounted, visible };
}

/** Fixed-position floating element anchored to a trigger; recomputes on scroll/resize. */
export function useFloating(
  active: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  placement: Placement,
  offset = 8,
  matchWidth = false
) {
  const [state, setState] = useState<{ style: CSSProperties; placement: Placement }>({
    style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
    placement,
  });

  const update = useCallback(() => {
    const t = triggerRef.current;
    const f = floatingRef.current;
    if (!t || !f) return;
    const tRect = t.getBoundingClientRect();
    const res = computePosition(tRect, f.getBoundingClientRect(), placement, offset);
    setState({
      style: { position: "fixed", top: res.top, left: res.left, ...(matchWidth ? { minWidth: tRect.width } : {}) },
      placement: res.placement,
    });
  }, [triggerRef, floatingRef, placement, offset, matchWidth]);

  useLayoutEffect(() => {
    if (!active) return;
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [active, update]);

  return { ...state, update };
}

/** Transform-origin for a placement (scale animation grows from the trigger). */
export const originClass: Record<Side, string> = {
  top: "origin-bottom",
  bottom: "origin-top",
  left: "origin-right",
  right: "origin-left",
};

/** Hidden-state offset (slides toward the trigger). */
export const hiddenShift: Record<Side, string> = {
  top: "translate-y-1",
  bottom: "-translate-y-1",
  left: "translate-x-1",
  right: "-translate-x-1",
};

/** Arrow position classes (a 8px rotated square). */
export const arrowClass: Record<Side, string> = {
  top: "left-1/2 -translate-x-1/2 -bottom-1",
  bottom: "left-1/2 -translate-x-1/2 -top-1",
  left: "top-1/2 -translate-y-1/2 -right-1",
  right: "top-1/2 -translate-y-1/2 -left-1",
};

/** Arrow classes that also respect -start / -end alignment. */
export function arrowPosition(placement: Placement): string {
  const [side, align] = placement.split("-") as [Side, "start" | "end" | undefined];
  if (!align) return arrowClass[side];
  const vertical = side === "top" || side === "bottom";
  const edge = side === "top" ? "-bottom-1" : side === "bottom" ? "-top-1" : side === "left" ? "-right-1" : "-left-1";
  const along = vertical ? (align === "start" ? "left-3" : "right-3") : align === "start" ? "top-2.5" : "bottom-2.5";
  return `${edge} ${along}`;
}

/** Merge refs helper. */
export function setRef<T>(ref: unknown, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object") (ref as { current: T }).current = value;
}

/** Background of the `glass-thick` material, for parts that can't carry backdrop-filter (arrows). */
export const GLASS_THICK_BG = "rgb(var(--nr-glass-tint) / min(1, calc(var(--nr-glass-alpha) + 0.2)))";

/**
 * Clip a rotate-45 arrow square to its outer triangle, so a translucent arrow
 * doesn't double-tint the area where it overlaps the panel.
 */
export function arrowClipPath(placement: Placement): string {
  const side = placement.split("-")[0] as Side;
  // panel above trigger → arrow points down (bottom-right corner of the rotated square), etc.
  if (side === "top") return "polygon(100% 0, 100% 100%, 0 100%)";
  if (side === "bottom") return "polygon(0 0, 100% 0, 0 100%)";
  if (side === "left") return "polygon(0 0, 100% 0, 100% 100%)";
  return "polygon(0 0, 100% 100%, 0 100%)";
}
