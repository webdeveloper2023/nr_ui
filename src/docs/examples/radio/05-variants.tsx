import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex items-center">
        <RadioGroup label="Primary" variant="primary" defaultValue="a">
          <Radio value="a">Birinchi</Radio>
          <Radio value="b">Ikkinchi</Radio>
        </RadioGroup>
      </div>
      <div className="rounded-3xl bg-surface p-5 shadow-surface">
        <RadioGroup label="Secondary (karta ichida)" variant="secondary" defaultValue="a">
          <Radio value="a">Birinchi</Radio>
          <Radio value="b">Ikkinchi</Radio>
        </RadioGroup>
      </div>
    </div>
  );
}
