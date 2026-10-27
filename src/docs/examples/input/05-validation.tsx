import { useState } from "react";
import { Input } from "nr-ui-kit";

export default function InputValidation() {
  const [email, setEmail] = useState("ali@acme");
  const isInvalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);

  return (
    <div className="mx-auto grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <Input
        label="Email"
        type="email"
        isRequired
        value={email}
        onValueChange={setEmail}
        isInvalid={isInvalid}
        errorMessage="To'g'ri email manzil kiriting"
        description="Biz emailingizni hech kimga bermaymiz"
      />
      <Input label="O'chirilgan" defaultValue="Tahrirlab bo'lmaydi" isDisabled />
      <Input label="Faqat o'qish" defaultValue="ID-48213" isReadOnly />
    </div>
  );
}
