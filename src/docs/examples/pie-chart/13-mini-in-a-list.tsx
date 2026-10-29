import { PieChart } from "nr-ui-kit";

// size="xs" without a legend fits a table row or a list item
const teams = [
  { name: "Design", done: 34, review: 8, todo: 6 },
  { name: "Frontend", done: 52, review: 14, todo: 19 },
  { name: "Backend", done: 41, review: 5, todo: 3 },
  { name: "QA", done: 12, review: 9, todo: 15 },
];

export default function MiniInAList() {
  return (
    <ul className="mx-auto w-full max-w-lg divide-y divide-separator rounded-3xl bg-surface shadow-surface">
      {teams.map((t) => {
        const total = t.done + t.review + t.todo;
        return (
          <li key={t.name} className="flex items-center gap-4 px-4 py-2">
            <div className="w-14 shrink-0">
              <PieChart
                aria-label={`${t.name} tasks`}
                size={56}
                variant="donut"
                thickness={0.4}
                gap={1.5}
                showLegend={false}
                centerValue={null}
                data={[
                  { key: "done", label: "Done", value: t.done },
                  { key: "review", label: "In review", value: t.review },
                  { key: "todo", label: "To do", value: t.todo },
                ]}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted">{t.done} done · {t.review} in review · {t.todo} to do</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">{Math.round((t.done / total) * 100)}%</span>
          </li>
        );
      })}
    </ul>
  );
}
