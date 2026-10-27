import type { ComponentType } from "react";

// Live example components + their raw source (shown in "Show code").
const exampleModules = import.meta.glob<{ default: ComponentType }>("./examples/*/*.tsx", { eager: true });
const exampleSources = import.meta.glob<string>("./examples/*/*.tsx", { query: "?raw", import: "default", eager: true });

// Library source files (shown in the "Source code" tab), loaded on demand.
const componentSources = import.meta.glob<string>("../components/*.{ts,tsx}", { query: "?raw", import: "default" });
const libSources = import.meta.glob<string>("../lib/*.ts", { query: "?raw", import: "default" });

export interface Example {
  id: string;
  title: string;
  Component: ComponentType;
  code: string;
}

const toTitle = (file: string) =>
  file
    .replace(/^\d+-/, "")
    .replace(/\.tsx$/, "")
    .split("-")
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");

export function getExamples(slug: string): Example[] {
  return Object.keys(exampleModules)
    .filter((path) => path.startsWith(`./examples/${slug}/`))
    .sort()
    .map((path) => {
      const file = path.split("/").pop()!;
      return {
        id: `${slug}-${file.replace(/\.tsx$/, "")}`,
        title: toTitle(file),
        Component: exampleModules[path].default,
        code: exampleSources[path].trim(),
      };
    });
}

export async function loadSource(file: string): Promise<string> {
  const loader = componentSources[`../components/${file}`] ?? libSources[`../lib/${file}`];
  return loader ? (await loader()).trim() : `// ${file} not found`;
}
