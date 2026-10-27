import React, {
  useState,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  isBordered?: boolean;
  isBlurred?: boolean;
  position?: "static" | "sticky";
  children?: ReactNode;
}

export interface NavbarBrandProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface NavbarContentProps extends HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end";
  children?: ReactNode;
}

export interface NavbarItemProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  children?: ReactNode;
}

export interface NavbarMenuToggleProps extends HTMLAttributes<HTMLButtonElement> {
  srOnlyText?: string;
}

export interface NavbarMenuProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

interface NavbarContextValue {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const NavbarContext = createContext<NavbarContextValue>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

const useNavbarContext = () => useContext(NavbarContext);

const maxWidthMap: Record<string, string> = {
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
      isBordered = false,
      isBlurred = true,
      position = "sticky",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <NavbarContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
        <nav
          ref={ref}
          className={[
            "w-full z-40 h-16",
            position === "sticky" ? "sticky top-0" : "",
            isBlurred
              ? "bg-white/70 backdrop-blur-lg backdrop-saturate-150"
              : "bg-white",
            isBordered ? "border-b border-default-200" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          <div
            className={`${maxWidthMap[maxWidth]} mx-auto h-full px-6 flex items-center gap-4`}
          >
            {children}
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </NavbarContext.Provider>
    );
  }
);

Navbar.displayName = "Navbar";

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-2 flex-shrink-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavbarBrand.displayName = "NavbarBrand";

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ justify = "start", children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "hidden md:flex items-center gap-6 flex-1",
          justifyMap[justify],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavbarContent.displayName = "NavbarContent";

export const NavbarItem = forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ isActive = false, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "relative text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-primary-500"
            : "text-default-600 hover:text-default-900",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
        {isActive && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
        )}
      </div>
    );
  }
);

NavbarItem.displayName = "NavbarItem";

export const NavbarMenuToggle = forwardRef<HTMLButtonElement, NavbarMenuToggleProps>(
  ({ srOnlyText = "Toggle menu", className = "", ...props }, ref) => {
    const { isMenuOpen, setIsMenuOpen } = useNavbarContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-label={srOnlyText}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={[
          "md:hidden relative w-10 h-10 flex items-center justify-center",
          "rounded-lg hover:bg-default-100 transition-colors cursor-pointer",
          className,
        ].join(" ")}
        {...props}
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span
            className={[
              "block h-0.5 bg-default-700 rounded-full transition-all duration-300 origin-center",
              isMenuOpen ? "rotate-45 translate-y-[7px]" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-0.5 bg-default-700 rounded-full transition-all duration-300",
              isMenuOpen ? "opacity-0 scale-x-0" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-0.5 bg-default-700 rounded-full transition-all duration-300 origin-center",
              isMenuOpen ? "-rotate-45 -translate-y-[7px]" : "",
            ].join(" ")}
          />
        </div>
      </button>
    );
  }
);

NavbarMenuToggle.displayName = "NavbarMenuToggle";

export const NavbarMenu = forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ children, className = "", ...props }, ref) => {
    const { isMenuOpen } = useNavbarContext();

    return (
      <div
        ref={ref}
        className={[
          "fixed top-16 left-0 right-0 bottom-0 z-40",
          "bg-white/95 backdrop-blur-lg",
          "md:hidden",
          "transition-all duration-300 ease-out",
          "flex flex-col gap-2 px-6 py-4 overflow-y-auto",
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavbarMenu.displayName = "NavbarMenu";

export default Navbar;
