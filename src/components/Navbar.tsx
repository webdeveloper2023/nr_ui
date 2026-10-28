import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

type NavbarMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Ichki kontentning maksimal kengligi */
  maxWidth?: NavbarMaxWidth;
  /** Navbar balandligi (CSS qiymat) */
  height?: string;
  /** Pastki chegara chizig'i */
  isBordered?: boolean;
  /** Shaffof blur fon */
  isBlurred?: boolean;
  /** Shisha materiali: frosted (klassik) yoki liquid (clear glass Liquid). Berilmasa global sozlama (html data-glass) ishlatiladi */
  material?: "frosted" | "liquid";
  /** Joylashuv turi */
  position?: "static" | "sticky" | "floating";
  /** Pastga scroll qilganda yashirish */
  shouldHideOnScroll?: boolean;
  /** Mobil menyu ochiqmi (boshqariladigan) */
  isMenuOpen?: boolean;
  /** Mobil menyu holati o'zgarganda chaqiriladi */
  onMenuOpenChange?: (open: boolean) => void;
  /** Ichki kontent */
  children?: ReactNode;
}

export interface NavbarBrandProps extends HTMLAttributes<HTMLDivElement> {
  /** Ichki kontent */
  children?: ReactNode;
}

export interface NavbarContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Gorizontal tekislash */
  justify?: "start" | "center" | "end";
  /** Mobilda ham ko'rinib turish (default md'dan kichikda yashiriladi) */
  isAlwaysVisible?: boolean;
  /** Ichki kontent */
  children?: ReactNode;
}

export interface NavbarItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Faol (tanlangan) holat */
  isActive?: boolean;
  /** Faol element ko'rinishi */
  variant?: "underline" | "pill" | "text";
  /** Ichki kontent */
  children?: ReactNode;
}

export interface NavbarMenuToggleProps extends HTMLAttributes<HTMLButtonElement> {
  /** Ekran o'quvchilar uchun matn */
  srOnlyText?: string;
}

export interface NavbarMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Ichki kontent */
  children?: ReactNode;
}

export interface NavbarMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Faol (tanlangan) holat */
  isActive?: boolean;
  /** Animatsiya kechikishi uchun tartib raqami */
  index?: number;
  /** Ichki kontent */
  children?: ReactNode;
}

interface NavbarContextValue {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  height: string;
}

const NavbarContext = createContext<NavbarContextValue>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
  height: "4rem",
});

const useNavbarContext = () => useContext(NavbarContext);

const maxWidthMap: Record<NavbarMaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      maxWidth = "lg",
      height = "4rem",
      isBordered = false,
      isBlurred = true,
      material,
      position = "sticky",
      shouldHideOnScroll = false,
      isMenuOpen: menuProp,
      onMenuOpenChange,
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const [menuState, setMenuState] = useState(false);
    const isMenuOpen = menuProp ?? menuState;
    const [isHidden, setIsHidden] = useState(false);
    const lastY = useRef(0);

    const setIsMenuOpen = useCallback(
      (open: boolean) => {
        setMenuState(open);
        onMenuOpenChange?.(open);
      },
      [onMenuOpenChange]
    );

    useEffect(() => {
      if (!shouldHideOnScroll) return;
      const onScroll = () => {
        const y = window.scrollY;
        setIsHidden(y > lastY.current && y > 80);
        lastY.current = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [shouldHideOnScroll]);

    useEffect(() => {
      if (!isMenuOpen) return;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }, [isMenuOpen, setIsMenuOpen]);

    const isFloating = position === "floating";

    return (
      <NavbarContext.Provider value={{ isMenuOpen, setIsMenuOpen, height }}>
        <nav
          ref={ref}
          data-glass={material}
          className={cn(
            "z-40 flex w-full items-center justify-center",
            "transition-transform duration-300 ease-(--ease-out-soft)",
            position !== "static" && "sticky top-0",
            isFloating && "px-4 pt-3",
            isHidden && !isMenuOpen && "-translate-y-[calc(100%+1rem)]",
            !isFloating &&
              (isBlurred
                ? // glass material without drop shadow — a hairline separator reads cleaner on full-width bars
                  "bg-[rgb(var(--nr-glass-tint)/var(--nr-glass-alpha))] [background-image:var(--nr-glass-image)] [-webkit-backdrop-filter:blur(var(--nr-glass-blur))_saturate(var(--nr-glass-saturate))_var(--nr-glass-filter)] [backdrop-filter:blur(var(--nr-glass-blur))_saturate(var(--nr-glass-saturate))_var(--nr-glass-filter)]"
                : "bg-background"),
            !isFloating && (isBordered || isBlurred) && "border-b border-separator",
            className
          )}
          style={{ ...style, ["--navbar-height" as string]: height }}
          {...props}
        >
          <header
            className={cn(
              "flex w-full items-center justify-between gap-4 px-6",
              maxWidthMap[maxWidth],
              isFloating &&
                cn(
                  "rounded-full pl-5 pr-2",
                  !isBlurred && "shadow-surface",
                  isBlurred ? "glass" : "bg-surface"
                )
            )}
            style={{ height }}
          >
            {children}
          </header>
        </nav>
      </NavbarContext.Provider>
    );
  }
);

Navbar.displayName = "Navbar";

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 flex-shrink-0 font-semibold text-foreground", className)} {...props}>
      {children}
    </div>
  )
);

NavbarBrand.displayName = "NavbarBrand";

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ justify = "start", isAlwaysVisible = false, children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        isAlwaysVisible ? "flex" : "hidden md:flex",
        "items-center gap-1 flex-1 h-full",
        justifyMap[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

NavbarContent.displayName = "NavbarContent";

const itemVariant = {
  underline: {
    base: "px-3 h-full",
    active: "text-foreground",
    idle: "text-muted hover:text-foreground",
  },
  pill: {
    base: "px-3 h-8 rounded-full",
    active: "bg-surface text-foreground shadow-surface",
    idle: "text-muted hover:text-foreground hover:bg-default/70",
  },
  text: {
    base: "px-3",
    active: "text-foreground",
    idle: "text-muted hover:text-foreground",
  },
};

export const NavbarItem = forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ isActive = false, variant = "underline", children, className = "", ...props }, ref) => {
    const v = itemVariant[variant];
    return (
      <div
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative flex items-center text-sm font-medium transition-colors duration-200 cursor-pointer",
          "[&_a]:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-focus [&_a]:rounded-md",
          v.base,
          isActive ? v.active : v.idle,
          className
        )}
        {...props}
      >
        {children}
        {variant === "underline" && (
          <span
            className={cn(
              "absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-foreground",
              "transition-[transform,opacity] duration-200 ease-(--ease-out-soft) origin-center",
              isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )}
          />
        )}
      </div>
    );
  }
);

NavbarItem.displayName = "NavbarItem";

export const NavbarMenuToggle = forwardRef<HTMLButtonElement, NavbarMenuToggleProps>(
  ({ srOnlyText = "Toggle menu", className = "", ...props }, ref) => {
    const { isMenuOpen, setIsMenuOpen } = useNavbarContext();
    const bar = "absolute left-0 block h-[1.5px] w-full rounded-full bg-foreground transition-all duration-300 ease-(--ease-out-soft)";

    return (
      <button
        ref={ref}
        type="button"
        aria-label={srOnlyText}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={cn(
          "md:hidden relative w-10 h-10 flex items-center justify-center",
          "rounded-full hover:bg-default active:scale-[0.95] transition-[background-color,transform] cursor-pointer",
          "outline-none focus-visible:ring-2 focus-visible:ring-focus",
          className
        )}
        {...props}
      >
        <span className="relative block w-[18px] h-3">
          <span className={cn(bar, isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
          <span className={cn(bar, "top-1/2 -translate-y-1/2", isMenuOpen && "opacity-0 scale-x-0")} />
          <span className={cn(bar, isMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0")} />
        </span>
      </button>
    );
  }
);

NavbarMenuToggle.displayName = "NavbarMenuToggle";

export const NavbarMenu = forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ children, className = "", style, ...props }, ref) => {
    const { isMenuOpen, height } = useNavbarContext();

    return (
      <div
        ref={ref}
        aria-hidden={!isMenuOpen}
        className={cn(
          "fixed left-0 right-0 bottom-0 z-40 md:hidden",
          "glass-thick",
          "flex flex-col gap-1 px-6 py-4 overflow-y-auto",
          "transition-[opacity,transform] duration-300 ease-(--ease-out-soft)",
          isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none",
          className
        )}
        style={{ top: height, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavbarMenu.displayName = "NavbarMenu";

export const NavbarMenuItem = forwardRef<HTMLDivElement, NavbarMenuItemProps>(
  ({ isActive = false, index = 0, children, className = "", style, ...props }, ref) => {
    const { isMenuOpen, setIsMenuOpen } = useNavbarContext();
    return (
      <div
        ref={ref}
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "flex items-center h-12 px-4 rounded-2xl text-base font-medium transition-all duration-300 ease-(--ease-out-soft)",
          isActive ? "bg-surface text-foreground shadow-surface" : "text-muted hover:bg-default/70 hover:text-foreground",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
          className
        )}
        style={{ transitionDelay: isMenuOpen ? `${60 + index * 35}ms` : "0ms", ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavbarMenuItem.displayName = "NavbarMenuItem";

export default Navbar;
