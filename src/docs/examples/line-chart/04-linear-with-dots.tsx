import { LineChart } from "nr-ui-kit";

const data = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 64 },
  { week: "W4", score: 71 },
  { week: "W5", score: 77 },
  { week: "W6", score: 74 },
];

export default function LinearWithDots() {
  return (
    <LineChart
      aria-label="Customer satisfaction score per week"
      data={data}
      xKey="week"
      series={[{ key: "score", label: "Score", color: "green" }]}
      curve="linear"
      showDots="all"
      baseline="zero"
      height={220}
    />
  );
}
