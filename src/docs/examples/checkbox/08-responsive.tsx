import { Checkbox, CheckboxGroup } from "nr-ui-kit";

export default function CheckboxResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* 44px tap rows on mobile; the horizontal group stacks vertically there */}
      <CheckboxGroup label="Notifications" orientation="horizontal" defaultValue={["email"]} responsive>
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
        <Checkbox value="push">Push</Checkbox>
      </CheckboxGroup>
      {/* Mobile only */}
      <Checkbox responsive={["m"]}>Remember me</Checkbox>
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
