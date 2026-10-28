import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioBasic() {
  return (
    <div className="flex justify-center">
      <RadioGroup label="Delivery" defaultValue="courier">
        <Radio value="courier">Courier</Radio>
        <Radio value="pickup">Pickup</Radio>
        <Radio value="post">Mail</Radio>
      </RadioGroup>
    </div>
  );
}
