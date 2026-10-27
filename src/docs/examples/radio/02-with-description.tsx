import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioWithDescription() {
  return (
    <div className="flex justify-center">
      <RadioGroup label="Tarif" defaultValue="pro">
        <Radio value="free" description="Shaxsiy loyihalar uchun">Free</Radio>
        <Radio value="pro" description="O'sayotgan jamoalar uchun">Pro</Radio>
        <Radio value="enterprise" description="SSO, SLA va shaxsiy menejer">Enterprise</Radio>
      </RadioGroup>
    </div>
  );
}
