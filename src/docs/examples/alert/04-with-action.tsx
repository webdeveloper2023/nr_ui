import { useState } from "react";
import { Alert, Button } from "nr-ui-kit";

export default function AlertWithAction() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex justify-center">
        <Button variant="tertiary" onClick={() => setVisible(true)}>
          Show alert again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Alert
        color="warning"
        variant="soft"
        title="Your payment card is expiring"
        description="Your Visa ending in 4242 expires on March 28. Update your details to keep your Pro subscription active."
        action={
          <Button size="sm" variant="tertiary">
            Update
          </Button>
        }
        onClose={() => setVisible(false)}
      />
    </div>
  );
}
