import React from "react";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  orientation?: DividerOrientation;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className = "",
}) => {
  const classes =
    orientation === "horizontal"
      ? `w-full h-px bg-default-200 shrink-0 ${className}`
      : `h-full w-px bg-default-200 shrink-0 self-stretch ${className}`;

  return <div className={classes} role="separator" aria-orientation={orientation} />;
};

Divider.displayName = "Divider";
export default Divider;
