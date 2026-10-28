import { PhoneInput } from "nr-ui-kit";

export default function PhoneInputValidation() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <PhoneInput
        country="UZ"
        label="Automatic validation"
        isRequired
        autoValidate
        description="Type half a number, then leave the field"
      />
      <PhoneInput
        country="UZ"
        label="Custom error message"
        autoValidate
        incompleteMessage="Please enter the full number"
        defaultValue="+99890123"
      />
    </div>
  );
}
