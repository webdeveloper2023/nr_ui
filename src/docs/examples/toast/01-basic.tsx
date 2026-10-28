import { Button, useToast } from "nr-ui-kit";

export default function ToastBasic() {
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Button
        variant="tertiary"
        onClick={() => addToast({ title: "File saved", description: "report.pdf was added to the folder." })}
      >
        Show toast
      </Button>
    </div>
  );
}
