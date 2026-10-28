import { Radio, RadioGroup } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function RadioSizes() {
  return (
    <div className="flex flex-wrap gap-10">
      {sizes.map((size) => (
        <RadioGroup key={size} label={`size="${size}"`} size={size} defaultValue="a">
          <Radio value="a">First</Radio>
          <Radio value="b">Second</Radio>
        </RadioGroup>
      ))}
    </div>
  );
}
