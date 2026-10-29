import { Button, ButtonGroup } from "nr-ui-kit";

// Below 768px: 44px touch targets and a full-width group with equal buttons.
export default function ButtonResponsive() {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        <Button responsive>responsive</Button>
        <Button variant="secondary" responsive={["m", "t"]}>Mobile and tablet</Button>
        <Button variant="tertiary">Static</Button>
      </div>
      <ButtonGroup responsive>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    </div>
  );
}
