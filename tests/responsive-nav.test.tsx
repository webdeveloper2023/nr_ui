import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "../src/components/Navbar";
import { Sidebar, SidebarItem, SidebarSection } from "../src/components/Sidebar";
import { Accordion, AccordionItem } from "../src/components/Accordion";
import { Pagination } from "../src/components/Pagination";
import { Stepper } from "../src/components/Stepper";
import { BillingToggle, PricingCard } from "../src/components/Pricing";
import { ChatContainer, ChatMessage, PromptInput } from "../src/components/Chat";
import { ResponsiveProvider } from "../src/components/Responsive";

const noop = () => {};

// jsdom has no Element.scrollTo (ChatContainer scrolls to the newest message)
Element.prototype.scrollTo ??= noop;

describe("responsive: navigation & blocks", () => {
  it("Navbar folds links on tablet only when 't' is listed", () => {
    const { rerender } = render(
      <Navbar responsive={["m", "t"]}>
        <NavbarContent data-testid="links">
          <NavbarItem>A</NavbarItem>
        </NavbarContent>
        <NavbarMenuToggle />
        <NavbarMenu data-testid="menu" />
      </Navbar>
    );
    expect(screen.getByTestId("links")).toHaveClass("hidden", "lg:flex");
    expect(screen.getByRole("button")).toHaveClass("lg:hidden", "mobile:w-11", "tablet:w-11");
    expect(screen.getByTestId("menu")).toHaveClass("lg:hidden", "mobile:px-4");

    rerender(
      <Navbar>
        <NavbarContent data-testid="links" />
        <NavbarMenuToggle />
      </Navbar>
    );
    expect(screen.getByTestId("links")).toHaveClass("md:flex");
    expect(screen.getByTestId("links")).not.toHaveClass("lg:flex");
    expect(screen.getByRole("button").className).not.toMatch(/mobile:|tablet:/);
  });

  it("Sidebar items get touch sizes only on the requested breakpoints", () => {
    const { rerender } = render(
      <Sidebar responsive="m">
        <SidebarSection>
          <SidebarItem itemKey="a" title="Home" />
        </SidebarSection>
      </Sidebar>
    );
    const item = screen.getByRole("button", { name: "Home" });
    expect(item).toHaveClass("mobile:h-11");
    expect(item.className).not.toContain("tablet:");
    expect(item.closest("aside")).toHaveClass("mobile:w-full");

    rerender(
      <Sidebar>
        <SidebarItem itemKey="a" title="Home" />
      </Sidebar>
    );
    expect(screen.getByRole("button", { name: "Home" }).className).not.toMatch(/mobile:|tablet:|desktop:/);
  });

  it("Accordion triggers are touch-sized and follow ResponsiveProvider", () => {
    render(
      <ResponsiveProvider responsive={["m", "d"]}>
        <Accordion variant="surface" data-testid="acc">
          <AccordionItem itemKey="1" title="Q">
            A
          </AccordionItem>
        </Accordion>
      </ResponsiveProvider>
    );
    const trigger = screen.getByRole("button", { name: "Q" });
    expect(trigger).toHaveClass("mobile:min-h-12", "desktop:py-5");
    expect(trigger).not.toHaveClass("tablet:min-h-12");
    expect(screen.getByTestId("acc")).toHaveClass("mobile:px-4", "desktop:px-7");
  });

  it("Pagination buttons are touch-sized only with responsive", () => {
    const { rerender } = render(<Pagination responsive={["t"]} total={5} page={1} onChange={noop} />);
    const pageButton = screen.getByRole("button", { name: "2" });
    expect(pageButton).toHaveClass("tablet:h-11");
    expect(pageButton).not.toHaveClass("mobile:h-11");
    rerender(<Pagination total={5} page={1} onChange={noop} />);
    expect(screen.getByRole("button", { name: "2" }).className).not.toMatch(/mobile:|tablet:/);
  });

  it("Stepper hides other labels on mobile", () => {
    render(<Stepper responsive steps={[{ title: "One", description: "d1" }, { title: "Two" }]} currentStep={0} />);
    expect(screen.getByText("One").parentElement).toHaveClass("mobile:whitespace-nowrap");
    expect(screen.getByText("Two").parentElement).toHaveClass("mobile:hidden");
    expect(screen.getByText("d1")).toHaveClass("mobile:hidden", "tablet:hidden");
  });

  it("Pricing fills the width on mobile and passes responsive to its button", () => {
    render(
      <>
        <BillingToggle responsive="m" value="monthly" onChange={noop} />
        <PricingCard responsive="m" name="Pro" price={{ monthly: 9, yearly: 90 }} period="monthly" features={[]} />
      </>
    );
    expect(screen.getByRole("radiogroup")).toHaveClass("mobile:w-full");
    expect(screen.getByRole("radio", { name: /month/i })).toHaveClass("mobile:flex-1", "mobile:h-11");
    expect(screen.getByRole("button", { name: /get started|choose/i })).toHaveClass("mobile:h-11");
    expect(screen.getByText("Pro").closest("div.relative")).not.toHaveClass("desktop:p-8");
  });

  it("Chat messages inherit the container's responsive", () => {
    render(
      <>
        <ChatContainer responsive={["m"]}>
          <ChatMessage role="user">Hi</ChatMessage>
        </ChatContainer>
        <PromptInput responsive={["m"]} />
      </>
    );
    expect(screen.getByRole("log")).toHaveClass("mobile:px-3");
    expect(screen.getByText("Hi")).toHaveClass("mobile:max-w-[88%]");
    expect(screen.getByText("Hi")).not.toHaveClass("desktop:text-base");
    expect(screen.getByRole("textbox")).toHaveClass("mobile:text-base");
  });
});
