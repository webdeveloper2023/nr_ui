import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Checkbox, CheckboxGroup } from "../src/components/Checkbox";
import { Radio, RadioGroup } from "../src/components/Radio";
import { Switch } from "../src/components/Switch";
import { FileUpload } from "../src/components/FileUpload";
import { Rating } from "../src/components/Rating";
import { PhoneInput } from "../src/components/PhoneInput";
import { AmountInput } from "../src/components/AmountInput";
import { ResponsiveProvider } from "../src/components/Responsive";

const classesOf = (el: Element | null) => el?.getAttribute("class") ?? "";
const html = (container: HTMLElement) => container.innerHTML;

describe("responsive form controls", () => {
  it("Checkbox adds mobile / tablet classes only for the requested breakpoints", () => {
    const { container, rerender } = render(<Checkbox>Remember me</Checkbox>);
    expect(html(container)).not.toMatch(/mobile:|tablet:/);

    rerender(<Checkbox responsive={["m"]}>Remember me</Checkbox>);
    const label = container.querySelector("label");
    expect(classesOf(label)).toContain("mobile:py-2.5");
    expect(html(container)).toContain("mobile:text-base");
    expect(html(container)).not.toContain("tablet:");

    rerender(<Checkbox responsive>Remember me</Checkbox>);
    expect(classesOf(container.querySelector("label"))).toContain("tablet:py-2");
  });

  it("CheckboxGroup passes responsive to its items and stacks on mobile", () => {
    const { container } = render(
      <CheckboxGroup orientation="horizontal" responsive="m">
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b" responsive={false}>
          B
        </Checkbox>
      </CheckboxGroup>
    );
    expect(html(container)).toContain("mobile:flex-col mobile:gap-0");
    const [a, b] = container.querySelectorAll("label");
    expect(classesOf(a)).toContain("mobile:py-2.5");
    expect(classesOf(b)).not.toContain("mobile:"); // own prop wins over the group
  });

  it("RadioGroup makes its radios touch-sized on the given breakpoints", () => {
    const { container } = render(
      <RadioGroup orientation="horizontal" responsive={["t"]}>
        <Radio value="a">A</Radio>
      </RadioGroup>
    );
    expect(classesOf(container.querySelector("label"))).toContain("tablet:py-2");
    expect(html(container)).not.toContain("mobile:");
  });

  it("Switch grows its track, thumb and travel together on mobile", () => {
    const { container } = render(
      <Switch defaultSelected responsive="m">
        Wi-Fi
      </Switch>
    );
    expect(html(container)).toContain("mobile:w-12 mobile:h-7");
    expect(html(container)).toContain("mobile:translate-x-5");
  });

  it("ResponsiveProvider turns it on for everything inside, and a component can opt out", () => {
    const { container } = render(
      <ResponsiveProvider>
        <Switch>On</Switch>
        <Rating defaultValue={2} />
        <FileUpload />
        <Checkbox responsive={false}>Off</Checkbox>
      </ResponsiveProvider>
    );
    expect(html(container)).toContain("mobile:w-12");
    expect(html(container)).toContain("mobile:size-6");
    expect(html(container)).toContain("desktop:py-14");
    const labels = container.querySelectorAll("label");
    expect(classesOf(labels[labels.length - 1])).not.toMatch(/mobile:|tablet:/);
  });

  it("PhoneInput and AmountInput pass responsive to the field", () => {
    render(
      <>
        <PhoneInput label="Phone" isCountrySelectable responsive="m" />
        <AmountInput label="Amount" presets={[1000]} responsive="t" />
      </>
    );
    expect(classesOf(screen.getByLabelText("Phone"))).toContain("mobile:text-base");
    expect(classesOf(screen.getByRole("combobox", { hidden: true }))).toContain("mobile:-inset-y-3");
    expect(classesOf(screen.getByRole("button", { name: /1 ?,?000/ }))).toContain("tablet:h-9");
    expect(classesOf(screen.getByLabelText("Amount"))).not.toContain("mobile:");
  });
});
