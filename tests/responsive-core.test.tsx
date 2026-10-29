import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { Button, ButtonGroup } from "../src/components/Button";
import { Card, CardBody } from "../src/components/Card";
import { Input } from "../src/components/Input";
import { Container, Grid, GridItem, Stack } from "../src/components/Layout";
import { Hide, ResponsiveProvider, Show } from "../src/components/Responsive";
import {
  breakpointQuery,
  resolveBreakpoints,
  rx,
  spaceClasses,
  spread,
  useBreakpoint,
} from "../src/components/breakpoints";

const classesOf = (el: Element) => el.className.split(/\s+/);

describe("breakpoint helpers", () => {
  it("resolves the responsive prop", () => {
    expect(resolveBreakpoints(true)).toEqual(["m", "t", "l", "d"]);
    expect(resolveBreakpoints(["d", "m"])).toEqual(["m", "d"]);
    expect(resolveBreakpoints("t")).toEqual(["t"]);
    expect(resolveBreakpoints(false)).toEqual([]);
    expect(resolveBreakpoints(undefined)).toEqual([]);
  });

  it("picks classes of the active breakpoints only", () => {
    expect(rx(["m"], { m: "mobile:h-11", d: "desktop:h-14" })).toBe("mobile:h-11");
    expect(rx([], { m: "mobile:h-11" })).toBe("");
  });

  it("spreads responsive values mobile-first", () => {
    expect(spread(3)).toEqual({ m: 3, t: 3, l: 3, d: 3 });
    expect(spread({ m: 1, l: 3 })).toEqual({ m: 1, t: 1, l: 3, d: 3 });
    expect(spread({ t: 2 })).toEqual({ m: 2, t: 2, l: 2, d: 2 });
  });

  it("builds media queries", () => {
    expect(breakpointQuery("m")).toBe("(max-width: 767px)");
    expect(breakpointQuery("t")).toBe("(min-width: 768px) and (max-width: 1023px)");
    expect(breakpointQuery("d")).toBe("(min-width: 1536px)");
  });

  it("follows the spacing scale only on active breakpoints", () => {
    expect(spaceClasses("gap", "md", [])).toBe("gap-4");
    expect(spaceClasses("gap", "md", ["m", "t", "l", "d"])).toBe("gap-4 mobile:gap-3 desktop:gap-5");
    expect(spaceClasses("gap", "md", ["m"])).toBe("gap-4 mobile:gap-3");
    // An object pins tokens per breakpoint
    expect(spaceClasses("px", { m: "sm", l: "xl" }, [])).toBe("px-8 mobile:px-2 tablet:px-2");
  });
});

describe("responsive prop", () => {
  it("adds touch sizes only for the requested breakpoints", () => {
    render(
      <>
        <Button>static</Button>
        <Button responsive>all</Button>
        <Button responsive={["t"]}>tablet</Button>
      </>
    );
    expect(classesOf(screen.getByText("static")).some((c) => /^(mobile|tablet|laptop|desktop):/.test(c))).toBe(false);
    expect(classesOf(screen.getByText("all"))).toEqual(expect.arrayContaining(["mobile:h-11", "tablet:h-11"]));
    expect(classesOf(screen.getByText("tablet"))).toContain("tablet:h-11");
    expect(classesOf(screen.getByText("tablet"))).not.toContain("mobile:h-11");
  });

  it("is inherited from ResponsiveProvider, and an own prop wins", () => {
    render(
      <ResponsiveProvider>
        <Button>inherited</Button>
        <Button responsive={false}>off</Button>
        <ButtonGroup>
          <Button>grouped</Button>
        </ButtonGroup>
      </ResponsiveProvider>
    );
    expect(classesOf(screen.getByText("inherited"))).toContain("mobile:h-11");
    expect(classesOf(screen.getByText("off"))).not.toContain("mobile:h-11");
    expect(classesOf(screen.getByText("grouped"))).toEqual(expect.arrayContaining(["mobile:h-11", "mobile:flex-1"]));
  });

  it("gives fields 16px text on mobile and stacks a left label", () => {
    render(<Input label="Name" labelPlacement="outside-left" responsive={["m"]} />);
    const input = screen.getByLabelText("Name");
    expect(classesOf(input)).toContain("mobile:text-base");
    expect(classesOf(input.closest("[class*='mobile:flex-col']")!)).toContain("mobile:flex-col");
  });

  it("passes the card's breakpoints to its parts", () => {
    render(
      <Card responsive={["d"]} data-testid="card">
        <CardBody>body</CardBody>
      </Card>
    );
    expect(classesOf(screen.getByText("body"))).toContain("desktop:px-6");
    expect(classesOf(screen.getByTestId("card"))).not.toContain("mobile:w-full");
  });
});

describe("layout", () => {
  it("collapses grid columns on small screens", () => {
    render(
      <Grid cols={4} responsive data-testid="grid">
        <GridItem span={3}>wide</GridItem>
      </Grid>
    );
    expect(classesOf(screen.getByTestId("grid"))).toEqual(expect.arrayContaining(["grid-cols-4", "mobile:grid-cols-1", "tablet:grid-cols-2"]));
    // The span is clamped to the columns of each breakpoint
    expect(classesOf(screen.getByText("wide"))).toEqual(expect.arrayContaining(["col-span-3", "mobile:col-span-1", "tablet:col-span-2"]));
  });

  it("keeps columns static without responsive and supports per-breakpoint objects", () => {
    const { rerender } = render(<Grid cols={3} data-testid="grid" />);
    expect(screen.getByTestId("grid").className).not.toContain("mobile:");
    rerender(<Grid cols={{ m: 2, d: 6 }} data-testid="grid" />);
    expect(classesOf(screen.getByTestId("grid"))).toEqual(expect.arrayContaining(["grid-cols-2", "desktop:grid-cols-6"]));
  });

  it("auto-fits by minimum width", () => {
    render(<Grid minChildWidth={160} data-testid="grid" />);
    expect(screen.getByTestId("grid").style.gridTemplateColumns).toBe("repeat(auto-fill, minmax(min(160px, 100%), 1fr))");
  });

  it("turns a row stack into a column on mobile", () => {
    render(
      <>
        <Stack direction="row" responsive data-testid="row" />
        <Stack direction="row" data-testid="static" />
        <Stack direction={{ m: "column", t: "row" }} data-testid="object" />
      </>
    );
    expect(classesOf(screen.getByTestId("row"))).toEqual(expect.arrayContaining(["flex-row", "mobile:flex-col"]));
    expect(classesOf(screen.getByTestId("static"))).not.toContain("mobile:flex-col");
    expect(classesOf(screen.getByTestId("object"))).toEqual(expect.arrayContaining(["flex-row", "mobile:flex-col"]));
  });

  it("renders the container as the requested element", () => {
    render(<Container as="main" responsive data-testid="c" />);
    const el = screen.getByTestId("c");
    expect(el.tagName).toBe("MAIN");
    expect(classesOf(el)).toEqual(expect.arrayContaining(["px-6", "mobile:px-4", "tablet:px-5", "desktop:px-7"]));
  });

  it("shows and hides with CSS", () => {
    render(
      <>
        <Show on={["m"]} data-testid="show" />
        <Hide on={["m", "t"]} data-testid="hide" />
      </>
    );
    expect(classesOf(screen.getByTestId("show"))).toEqual(expect.arrayContaining(["contents", "tablet:hidden", "laptop:hidden", "desktop:hidden"]));
    expect(classesOf(screen.getByTestId("show"))).not.toContain("mobile:hidden");
    expect(classesOf(screen.getByTestId("hide"))).toEqual(expect.arrayContaining(["mobile:hidden", "tablet:hidden"]));
  });
});

describe("useBreakpoint", () => {
  it("reads the current breakpoint from matchMedia", () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(min-width: 768px) and (max-width: 1023px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("t");
    window.matchMedia = original;
  });
});
