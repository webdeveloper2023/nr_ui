import { Spinner } from "nr-ui-kit";

export default function SpinnerVariants() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-12">
      <Spinner variant="default" label="default" />
      <Spinner variant="dots" label="dots" />
      <Spinner variant="wave" label="wave" />
      <Spinner variant="spinner" label="spinner" />
    </div>
  );
}
