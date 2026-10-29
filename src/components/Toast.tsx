import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useBreakpoint, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type ToastColor = "default" | "accent" | "success" | "warning" | "danger";
type ToastPlacement = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export interface ToastOptions {
  /** Notification title */
  title: ReactNode;
  /** Extra description text */
  description?: ReactNode;
  /** Status color (icon and progress bar) */
  color?: ToastColor;
  /** Icon */
  icon?: ReactNode;
  /** Auto-dismiss delay in ms; 0 keeps it open. Default 5000 */
  timeout?: number;
  /** Hides the icon */
  hideIcon?: boolean;
  /** Action button (e.g. "Retry") */
  action?: ReactNode;
  /** Called when the toast closes */
  onClose?: () => void;
  /** Glass (blur) background for this toast; defaults to the ToastProvider value */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
}

interface ToastItem extends ToastOptions {
  id: string;
  isClosing: boolean;
}

interface ToastContextValue {
  addToast: (options: ToastOptions) => string;
  closeToast: (id: string) => void;
  closeAll: () => void;
}

export interface ToastProviderProps {
  /** Position on screen */
  placement?: ToastPlacement;
  /** Maximum number of toasts visible at once */
  maxVisible?: number;
  /** Glass (blur) background for all toasts (default true) */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Adapts to the screen: on mobile toasts span the full width at the bottom (any placement) with a touch-sized close button; wider toasts with roomier padding on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** App content */
  children?: ReactNode;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const tone: Record<ToastColor, { icon: string; bar: string }> = {
  default: { icon: "bg-default text-foreground", bar: "bg-foreground/40" },
  accent: { icon: "bg-accent-soft text-accent-soft-foreground", bar: "bg-accent" },
  success: { icon: "bg-success-soft text-success-soft-foreground", bar: "bg-success" },
  warning: { icon: "bg-warning-soft text-warning-soft-foreground", bar: "bg-warning" },
  danger: { icon: "bg-danger-soft text-danger-soft-foreground", bar: "bg-danger" },
};

const iconPath: Record<ToastColor, ReactNode> = {
  default: <path d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  accent: <path d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  success: <path d="m8.5 12.5 2.5 2.5 5-5.5M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  warning: <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  danger: <path d="m15 9-6 6m0-6 6 6m7-3a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
};

const placementStyles: Record<ToastPlacement, string> = {
  "top-left": "top-4 left-4 items-start flex-col",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center flex-col",
  "top-right": "top-4 right-4 items-end flex-col",
  "bottom-left": "bottom-4 left-4 items-start flex-col-reverse",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center flex-col-reverse",
  "bottom-right": "bottom-4 right-4 items-end flex-col-reverse",
};

// Mobile: one full-width column at the bottom, above the home indicator. Desktop: wider, roomier cards.
const regionR: BreakpointClasses = {
  m: "mobile:top-auto mobile:bottom-[max(0.75rem,env(safe-area-inset-bottom))] mobile:left-3 mobile:right-3 mobile:translate-x-0 mobile:flex-col-reverse mobile:items-stretch",
};
const cardR: BreakpointClasses = { m: "mobile:w-full mobile:max-w-none mobile:pr-12", d: "desktop:w-[400px] desktop:p-4 desktop:pr-11" };
const closeR: BreakpointClasses = { m: "mobile:top-2.5 mobile:right-2.5 mobile:h-9 mobile:w-9", t: "tablet:h-8 tablet:w-8" };

const progressKeyframes = `@keyframes nr-toast-progress { from { transform: scaleX(1) } to { transform: scaleX(0) } }`;

const EXIT_MS = 200;

const ToastCard: React.FC<{
  toast: ToastItem;
  isTop: boolean;
  fromTop: boolean;
  isBlurred: boolean;
  material?: "frosted" | "liquid";
  bps: Breakpoint[];
  onClose: (id: string) => void;
}> = ({ toast, isTop, fromTop, isBlurred, material, bps, onClose }) => {
  const t = useLocale();
  const { id, title, description, color = "default", icon, timeout = 5000, hideIcon, action, isClosing } = toast;
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(timeout);
  const startedAt = useRef(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!timeout || paused || isClosing) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onClose(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [timeout, paused, isClosing, id, onClose]);

  const shown = entered && !isClosing;

  return (
    <div
      role="status"
      data-glass={toast.material ?? material}
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden",
        "flex items-start gap-3 rounded-2xl p-3.5 pr-10 text-foreground",
        (toast.isBlurred ?? isBlurred) ? "glass-thick" : "bg-overlay shadow-overlay",
        "transition-[opacity,transform] duration-200 ease-(--ease-out-soft)",
        shown ? "opacity-100 translate-y-0 scale-100" : cn("opacity-0 scale-95", fromTop ? "-translate-y-3" : "translate-y-3"),
        rx(bps, cardR),
        !isTop && "max-sm:hidden"
      )}
    >
      {!hideIcon && (
        <span className={cn("flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full", tone[color].icon)}>
          {icon ?? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {iconPath[color]}
            </svg>
          )}
        </span>
      )}
      <div className="min-w-0 flex-1 pt-1.5">
        <div className="text-sm font-medium leading-5 text-foreground">{title}</div>
        {description && <div className="mt-0.5 text-sm leading-5 text-muted">{description}</div>}
        {action && <div className="mt-3 flex gap-2">{action}</div>}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label={t.common.close}
        className={cn(
          "absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full text-muted hover:bg-default hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus",
          rx(bps, closeR)
        )}
      >
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </button>
      {timeout > 0 && (
        <span
          className={cn("absolute bottom-0 left-0 h-[2px] w-full origin-left opacity-60", tone[color].bar)}
          style={{
            animation: `nr-toast-progress ${timeout}ms linear forwards`,
            animationPlayState: paused || isClosing ? "paused" : "running",
          }}
        />
      )}
    </div>
  );
};

let toastCounter = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  placement = "bottom-right",
  maxVisible = 5,
  isBlurred = true,
  material,
  responsive,
  children,
}) => {
  const bps = useResponsive(responsive);
  const bp = useBreakpoint();
  // On a mobile screen with the mobile layout on, toasts always come from the bottom
  const fromTop = placement.startsWith("top") && !(bp === "m" && bps.includes("m"));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastsRef = useRef<ToastItem[]>([]);
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const closeToast = useCallback(
    (id: string) => {
      const target = toastsRef.current.find((t) => t.id === id);
      if (!target || target.isClosing) return;
      target.onClose?.();
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, isClosing: true } : t)));
      setTimeout(() => remove(id), EXIT_MS);
    },
    [remove]
  );

  const addToast = useCallback(
    (options: ToastOptions) => {
      const id = `nr-toast-${++toastCounter}`;
      setToasts((list) => [...list, { ...options, id, isClosing: false }].slice(-maxVisible));
      return id;
    },
    [maxVisible]
  );

  const closeAll = useCallback(() => {
    setToasts((list) => list.map((t) => ({ ...t, isClosing: true })));
    setTimeout(() => setToasts([]), EXIT_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, closeToast, closeAll }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className={cn("pointer-events-none fixed z-[10000] flex gap-2", placementStyles[placement], rx(bps, regionR))}>
            <style>{progressKeyframes}</style>
            {toasts.map((t, i) => (
              <ToastCard
                key={t.id}
                toast={t}
                isTop={i === toasts.length - 1}
                fromTop={fromTop}
                isBlurred={isBlurred}
                material={material}
                bps={bps}
                onClose={closeToast}
              />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

export default ToastProvider;
