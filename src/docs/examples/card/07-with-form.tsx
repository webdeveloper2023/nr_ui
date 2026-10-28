import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "nr-ui-kit";

export default function CardWithForm() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader title="Sign in" description="Sign in to your account to continue." />
      <CardBody className="gap-3">
        <Input variant="secondary" label="Email" type="email" placeholder="you@example.com" />
        <Input variant="secondary" label="Password" type="password" placeholder="••••••••" />
      </CardBody>
      <CardFooter className="flex-col">
        <Button fullWidth>Sign in</Button>
        <Button fullWidth variant="ghost">Create account</Button>
      </CardFooter>
    </Card>
  );
}
