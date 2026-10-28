import { useState } from "react";
import { Checkbox, CheckboxGroup } from "nr-ui-kit";

export default function CheckboxGroupExample() {
  const [stack, setStack] = useState<string[]>(["react", "ts"]);

  return (
    <div className="flex flex-wrap justify-center gap-12">
      <CheckboxGroup label="Technologies" value={stack} onValueChange={setStack} description={`Selected: ${stack.join(", ") || "—"}`}>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="ts">TypeScript</Checkbox>
        <Checkbox value="tw">Tailwind CSS</Checkbox>
        <Checkbox value="node">Node.js</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup label="Days" orientation="horizontal" defaultValue={["mon", "wed"]} radius="full">
        <Checkbox value="mon">Mon</Checkbox>
        <Checkbox value="tue">Tue</Checkbox>
        <Checkbox value="wed">Wed</Checkbox>
        <Checkbox value="thu">Thu</Checkbox>
        <Checkbox value="fri">Fri</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
