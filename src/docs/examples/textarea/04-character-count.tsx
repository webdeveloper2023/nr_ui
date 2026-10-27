import { useState } from "react";
import { Textarea } from "nr-ui-kit";

export default function TextareaCharacterCount() {
  const [bio, setBio] = useState("Frontend dasturchi. React va dizayn tizimlari.");

  return (
    <div className="mx-auto w-full max-w-md">
      <Textarea
        label="Bio"
        value={bio}
        onValueChange={setBio}
        maxLength={160}
        showCount
        description="Profilingizda ko'rinadi"
      />
    </div>
  );
}
