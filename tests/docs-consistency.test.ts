import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { COMPONENT_COUNT, PART_COUNT } from "../src/docs/stats";

// Vitest runs from the project root
const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");
const pkg = JSON.parse(read("package.json")) as { name: string; license: string };

describe("docs consistency", () => {
  it("README states the same component counts as the docs site", () => {
    const readme = read("README.md");
    expect(readme).toContain(`${COMPONENT_COUNT} ta komponent`);
    expect(readme).toContain(`bilan birga ${PART_COUNT} ta`);
    expect(readme).not.toMatch(/\d+\+ (ta )?komponent/);
  });

  it("README, package.json and LICENSE agree on the license and install command", () => {
    const readme = read("README.md");
    expect(pkg.license).toBe("MIT");
    expect(read("LICENSE")).toMatch(/^MIT License/);
    expect(readme).toContain(`npm install ${pkg.name}`);
    expect(readme).not.toMatch(/UNLICENSED|proprietary|\$10|github:webdeveloper2023/i);
  });
});
