import { useState } from "react";
import { Alert, Button } from "nr-ui-kit";

export default function AlertWithAction() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex justify-center">
        <Button variant="tertiary" onClick={() => setVisible(true)}>
          Alertni qaytarish
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Alert
        color="warning"
        variant="soft"
        title="To'lov kartasi muddati tugayapti"
        description="4242 bilan tugaydigan Visa kartangiz 28-mart kuni tugaydi. Pro obunani to'xtatmaslik uchun ma'lumotni yangilang."
        action={
          <Button size="sm" variant="tertiary">
            Yangilash
          </Button>
        }
        onClose={() => setVisible(false)}
      />
    </div>
  );
}
