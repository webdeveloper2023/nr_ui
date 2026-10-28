import { Textarea } from "nr-ui-kit";

export default function TextareaStates() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <Textarea label="Required" isRequired placeholder="Address" minRows={2} />
      <Textarea label="Error" isInvalid errorMessage="At least 20 characters" defaultValue="Too short" minRows={2} />
      <Textarea label="Disabled" isDisabled defaultValue="Not editable" minRows={2} />
    </div>
  );
}
