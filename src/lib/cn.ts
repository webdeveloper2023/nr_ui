export type ClassValue = string | number | bigint | boolean | null | undefined;

/** Joins truthy class names: cn("a", cond && "b") */
export function cn(...classes: ClassValue[]): string {
  return classes.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
