import { Button, Form, Input, Textarea } from "nr-ui-kit";

// When most fields are required, mark the few optional ones instead — in words.
export default function OptionalFields() {
  return (
    <Form showOptional necessityIndicator="text" labelPlacement="inside" className="max-w-md">
      <Input label="Full name" isRequired />
      <Input label="Email" type="email" isRequired />
      <Input label="Company" />
      <Textarea label="How did you hear about us?" minRows={2} />
      <Button type="submit" className="self-start">
        Send request
      </Button>
    </Form>
  );
}
