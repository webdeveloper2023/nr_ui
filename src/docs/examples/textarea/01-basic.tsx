import { Textarea } from "nr-ui-kit";

export default function TextareaBasic() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Textarea label="Comment" placeholder="Share your thoughts..." />
    </div>
  );
}
