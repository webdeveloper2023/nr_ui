import { useState } from "react";
import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioControlledAndInvalid() {
  const [payment, setPayment] = useState("");

  return (
    <div className="flex justify-center">
      <RadioGroup
        label="Payment method"
        isRequired
        value={payment}
        onValueChange={setPayment}
        isInvalid={!payment}
        errorMessage="Select a payment method"
        description={payment ? `Selected: ${payment}` : undefined}
      >
        <Radio value="card">Card</Radio>
        <Radio value="cash">Cash</Radio>
        <Radio value="transfer" isDisabled>
          Bank transfer (coming soon)
        </Radio>
      </RadioGroup>
    </div>
  );
}
