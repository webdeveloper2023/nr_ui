import { useState } from "react";
import { Textarea } from "nr-ui-kit";

export default function TextareaCharacterCount() {
  const [bio, setBio] = useState("Frontend developer. React and design systems.");

  return (
    <div className="mx-auto w-full max-w-md">
      <Textarea
        label="Bio"
        value={bio}
        onValueChange={setBio}
        maxLength={160}
        showCount
        description="Shown on your profile"
      />
    </div>
  );
}
