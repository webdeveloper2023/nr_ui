import { Button, useToast } from "nr-ui-kit";

export default function ToastWithAction() {
  const { addToast, closeToast } = useToast();

  const remove = () => {
    const id = addToast({
      title: "Xabar o'chirildi",
      description: "Uni hali qaytarishingiz mumkin.",
      timeout: 0, // 0 — o'zi yopilmaydi
      action: (
        <Button
          size="sm"
          variant="tertiary"
          onClick={() => {
            closeToast(id);
            addToast({ title: "Xabar qaytarildi", color: "success" });
          }}
        >
          Bekor qilish
        </Button>
      ),
    });
  };

  return (
    <div className="flex justify-center">
      <Button variant="danger-soft" onClick={remove}>
        Xabarni o'chirish
      </Button>
    </div>
  );
}
