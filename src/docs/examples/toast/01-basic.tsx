import { Button, useToast } from "nr-ui-kit";

export default function ToastBasic() {
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Button
        variant="tertiary"
        onClick={() => addToast({ title: "Fayl saqlandi", description: "hisobot.pdf papkaga qo'shildi." })}
      >
        Toast ko'rsatish
      </Button>
    </div>
  );
}
