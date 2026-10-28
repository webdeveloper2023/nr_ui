import { Button, Card, CardBody, Divider, Input } from "nr-ui-kit";

export default function DividerWithLabel() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardBody className="gap-4 py-4">
        <Button variant="outline" fullWidth>Continue with Google</Button>
        <Divider>or</Divider>
        <Input variant="secondary" placeholder="Your email address" />
        <Button fullWidth>Continue</Button>
      </CardBody>
    </Card>
  );
}
