import { Alert } from "nr-ui-kit";

export default function AlertBasic() {
  return (
    <div className="mx-auto max-w-xl">
      <Alert
        title="A new version is out"
        description="NR UI 2.0 — refreshed design, dark mode and 40+ components. Run npm update to upgrade."
      />
    </div>
  );
}
