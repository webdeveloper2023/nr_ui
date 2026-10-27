import { Button, useToast } from "nr-ui-kit";
import { CloudUpload } from "lucide-react";

export default function ToastIconAndTimeout() {
  const { addToast, closeAll } = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="tertiary"
        onClick={() =>
          addToast({
            title: "Zaxira nusxa yaratildi",
            description: "Bulutga 2 soniyada yuklandi.",
            icon: <CloudUpload size={16} />,
            color: "accent",
            timeout: 2000,
          })
        }
      >
        Maxsus ikonka (2s)
      </Button>
      <Button variant="tertiary" onClick={() => addToast({ title: "Ikonkasiz toast", hideIcon: true, timeout: 8000 })}>
        Ikonkasiz (8s)
      </Button>
      <Button variant="ghost" onClick={closeAll}>
        Hammasini yopish
      </Button>
    </div>
  );
}
