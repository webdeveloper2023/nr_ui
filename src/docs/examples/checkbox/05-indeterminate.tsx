import { useState } from "react";
import { Checkbox } from "nr-ui-kit";

const tasks = ["Design", "Frontend", "Backend", "Test"];

export default function CheckboxIndeterminate() {
  const [done, setDone] = useState<string[]>(["Design", "Frontend"]);
  const all = done.length === tasks.length;

  const toggle = (t: string, on: boolean) => setDone((d) => (on ? [...d, t] : d.filter((x) => x !== t)));

  return (
    <div className="mx-auto flex w-fit flex-col gap-3">
      <Checkbox
        isSelected={all}
        isIndeterminate={done.length > 0 && !all}
        onValueChange={(on) => setDone(on ? tasks : [])}
      >
        <span className="font-medium">All</span>
      </Checkbox>
      <div className="flex flex-col gap-3 pl-7">
        {tasks.map((t) => (
          <Checkbox key={t} isSelected={done.includes(t)} onValueChange={(on) => toggle(t, on)} lineThrough>
            {t}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}
