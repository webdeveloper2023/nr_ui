import { Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

export default function CardBasic() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader title="Upgrade to Pro" description="Unlimited projects and analytics for your team." />
      <CardBody className="text-muted">
        Includes a 14-day free trial. Cancel anytime.
      </CardBody>
      <CardFooter>
        <Button variant="tertiary" size="sm">Later</Button>
        <Button size="sm">Get started</Button>
      </CardFooter>
    </Card>
  );
}
