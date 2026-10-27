import { Spinner } from "nr-ui-kit";

export default function SpinnerColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <Spinner color="default" />
      <Spinner color="accent" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
    </div>
  );
}
