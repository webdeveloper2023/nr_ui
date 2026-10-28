import { Button } from "nr-ui-kit";

export default function ButtonFullWidth() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <Button fullWidth>Create account</Button>
      <Button fullWidth variant="tertiary">
        Sign in
      </Button>
    </div>
  );
}
