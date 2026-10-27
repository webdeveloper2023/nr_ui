import { useState } from "react";
import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioControlledAndInvalid() {
  const [payment, setPayment] = useState("");

  return (
    <div className="flex justify-center">
      <RadioGroup
        label="To'lov usuli"
        isRequired
        value={payment}
        onValueChange={setPayment}
        isInvalid={!payment}
        errorMessage="To'lov usulini tanlang"
        description={payment ? `Tanlangan: ${payment}` : undefined}
      >
        <Radio value="card">Karta</Radio>
        <Radio value="cash">Naqd</Radio>
        <Radio value="transfer" isDisabled>
          Bank o'tkazmasi (tez orada)
        </Radio>
      </RadioGroup>
    </div>
  );
}
