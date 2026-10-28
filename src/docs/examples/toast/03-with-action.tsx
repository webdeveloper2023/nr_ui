import { Button, useToast } from "nr-ui-kit";

export default function ToastWithAction() {
  const { addToast, closeToast } = useToast();

  const remove = () => {
    const id = addToast({
      title: "Message deleted",
      description: "You can still restore it.",
      timeout: 0, // 0 — never closes on its own
      action: (
        <Button
          size="sm"
          variant="tertiary"
          onClick={() => {
            closeToast(id);
            addToast({ title: "Message restored", color: "success" });
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  return (
    <div className="flex justify-center">
      <Button variant="danger-soft" onClick={remove}>
        Delete message
      </Button>
    </div>
  );
}
