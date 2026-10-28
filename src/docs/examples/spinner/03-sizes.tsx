import { Spinner } from "nr-ui-kit";

export default function SpinnerSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-10">
      <Spinner size="xs" label="Extra small" />
      <Spinner size="sm" label="Small" />
      <Spinner size="md" label="Medium" />
      <Spinner size="lg" label="Large" />
    </div>
  );
}
