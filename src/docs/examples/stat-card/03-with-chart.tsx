import { StatCard } from "nr-ui-kit";

export default function StatCardWithChart() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatCard title="Tashriflar" value="48.2K" change={8.1} chartData={[12, 18, 15, 22, 19, 27, 25, 31]} />
      <StatCard title="Sotuvlar" value="$24,801" change={3.2} color="success" chartData={[30, 28, 34, 33, 38, 36, 41, 44]} />
      <StatCard title="Qaytarishlar" value="132" change={4.6} chartData={[8, 12, 10, 15, 14, 18, 17, 21]} changeLabel="O'tgan haftaga nisbatan" />
    </div>
  );
}
