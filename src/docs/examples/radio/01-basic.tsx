import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioBasic() {
  return (
    <div className="flex justify-center">
      <RadioGroup label="Yetkazib berish" defaultValue="courier">
        <Radio value="courier">Kuryer</Radio>
        <Radio value="pickup">Olib ketish</Radio>
        <Radio value="post">Pochta</Radio>
      </RadioGroup>
    </div>
  );
}
