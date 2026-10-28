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
        errorMessage="Enter a valid email address"
        description="We never share your email"
      />
      <Input label="Disabled" defaultValue="Not editable" isDisabled />
      <Input label="Read only" defaultValue="ID-48213" isReadOnly />
    </div>
  );
}
