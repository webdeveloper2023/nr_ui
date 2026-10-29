import { useState } from "react";
import { Input, Textarea } from "nr-ui-kit";

// The extras developers usually hand-build: an info tooltip, a link or a counter at the end of the label row.
export default function TooltipAndEndContent() {
  const [bio, setBio] = useState("");
  return (
    <div className="grid w-full max-w-md gap-4">
      <Input
        label="Tax ID"
        labelTooltip="9 digits, printed on your registration certificate."
        placeholder="123 456 789"
        isRequired
      />
      <Input
        label="Password"
        type="password"
        labelEndContent={
          <a href="#" className="text-accent hover:underline">
            Forgot password?
          </a>
        }
      />
      <Textarea
        label="Bio"
        value={bio}
        onValueChange={setBio}
        maxLength={160}
        labelEndContent={<span className="tabular-nums text-muted">{bio.length} / 160</span>}
      />
    </div>
  );
}
