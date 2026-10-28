import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioWithDescription() {
  return (
    <div className="flex justify-center">
      <RadioGroup label="Plan" defaultValue="pro">
        <Radio value="free" description="For personal projects">Free</Radio>
        <Radio value="pro" description="For growing teams">Pro</Radio>
        <Radio value="enterprise" description="SSO, SLA and a dedicated manager">Enterprise</Radio>
      </RadioGroup>
    </div>
  );
}
