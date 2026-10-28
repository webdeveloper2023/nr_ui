import { Checkbox } from "nr-ui-kit";

export default function CheckboxWithDescription() {
  return (
    <div className="mx-auto flex w-fit flex-col gap-4">
      <Checkbox defaultSelected description="Weekly news and articles">
        Email newsletter
      </Checkbox>
      <Checkbox description="We'll alert you about new sign-ins">Security alerts</Checkbox>
      <Checkbox isInvalid description="Required to continue">
        I accept the privacy policy
      </Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
    </div>
  );
}
