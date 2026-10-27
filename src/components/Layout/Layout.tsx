import { type ReactNode } from "react";

interface LayoutProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Layout({ sidebar, header, children, className = "" }: LayoutProps) {
  return (
    <div className={`flex h-screen overflow-hidden ${className}`}>
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {header && (
          <header className="h-14 flex items-center px-6 border-b border-default-200 bg-white shrink-0">
            {header}
          </header>
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-default-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
