import { useState } from "react";
import { Checkbox, CheckboxGroup } from "nr-ui-kit";

export default function CheckboxGroupExample() {
  const [stack, setStack] = useState<string[]>(["react", "ts"]);

  return (
    <div className="flex flex-wrap justify-center gap-12">
      <CheckboxGroup label="Texnologiyalar" value={stack} onValueChange={setStack} description={`Tanlangan: ${stack.join(", ") || "—"}`}>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="ts">TypeScript</Checkbox>
        <Checkbox value="tw">Tailwind CSS</Checkbox>
        <Checkbox value="node">Node.js</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup label="Kunlar" orientation="horizontal" defaultValue={["mon", "wed"]} radius="full">
        <Checkbox value="mon">Du</Checkbox>
        <Checkbox value="tue">Se</Checkbox>
        <Checkbox value="wed">Ch</Checkbox>
        <Checkbox value="thu">Pa</Checkbox>
        <Checkbox value="fri">Ju</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
