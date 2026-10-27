import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioHorizontal() {
  return (
    <div className="flex flex-col items-center gap-8">
      <RadioGroup label="O'lcham" orientation="horizontal" defaultValue="m">
        <Radio value="s">S</Radio>
        <Radio value="m">M</Radio>
        <Radio value="l">L</Radio>
        <Radio value="xl">XL</Radio>
      </RadioGroup>
      <RadioGroup label="Rang va o'lcham" orientation="horizontal" color="success" size="lg" defaultValue="yes">
        <Radio value="yes">Ha</Radio>
        <Radio value="no">Yo'q</Radio>
      </RadioGroup>
    </div>
  );
}
