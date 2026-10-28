import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioHorizontal() {
  return (
    <div className="flex flex-col items-center gap-8">
      <RadioGroup label="Size" orientation="horizontal" defaultValue="m">
        <Radio value="s">S</Radio>
        <Radio value="m">M</Radio>
        <Radio value="l">L</Radio>
        <Radio value="xl">XL</Radio>
      </RadioGroup>
      <RadioGroup label="Color and size" orientation="horizontal" color="success" size="lg" defaultValue="yes">
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>
    </div>
  );
}
