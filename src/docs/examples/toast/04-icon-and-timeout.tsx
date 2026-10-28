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
            title: "Backup created",
            description: "Uploaded to the cloud in 2 seconds.",
            icon: <CloudUpload size={16} />,
            color: "accent",
            timeout: 2000,
          })
        }
      >
        Custom icon (2s)
      </Button>
      <Button variant="tertiary" onClick={() => addToast({ title: "Toast without an icon", hideIcon: true, timeout: 8000 })}>
        No icon (8s)
      </Button>
      <Button variant="ghost" onClick={closeAll}>
        Close all
      </Button>
    </div>
  );
}
