import { createContext, createElement, forwardRef, useContext, type ComponentType, type ReactNode } from "react";

/**
 * Skeleton state shared by every component.
 * With skeleton={true} a component keeps its own layout and shape while data loads: text turns into
 * soft bars; controls, icons, media and filled shapes into blocks (see [data-skeleton] in theme.css).
 * Components inside a component in the skeleton state follow it.
 */
const SkeletonContext = createContext(false);

/** The component's own `skeleton` prop wins; otherwise it follows the nearest parent in the skeleton state */
export function useSkeleton(skeleton?: boolean): boolean {
  const inherited = useContext(SkeletonContext);
  return skeleton ?? inherited;
}

/** Attributes for an element that shows the skeleton: the look, busy for screen readers, no focus or clicks */
export function skeletonAttrs(on: boolean) {
  return on ? ({ "data-skeleton": "", "aria-busy": true, inert: true } as const) : {};
}

/** Passes the skeleton state to components rendered inside (portals included) */
export function SkeletonScope({ on, children }: { on: boolean; children?: ReactNode }) {
  return createElement(SkeletonContext.Provider, { value: on }, children);
}

/**
 * Adds the `skeleton` prop to a component. Without it the component renders exactly as before;
 * with it, a layout-free wrapper (display: contents) carries the skeleton state for the whole subtree.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withSkeleton<C extends ComponentType<any>>(Component: C): C {
  const Wrapped = forwardRef<unknown, { skeleton?: boolean }>(({ skeleton, ...rest }, ref) => {
    const inner = createElement(Component, { ...rest, ref } as never);
    if (!skeleton) return inner;
    return createElement(
      "span",
      { ...skeletonAttrs(true), style: { display: "contents" } },
      createElement(SkeletonContext.Provider, { value: true }, inner)
    );
  });
  Wrapped.displayName = Component.displayName ?? Component.name;
  return Wrapped as unknown as C;
}
