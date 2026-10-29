import { Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

// Mobile: full width with a smaller radius. Desktop (≥1536px): roomier header, body and footer.
export default function CardResponsive() {
  return (
    <Card responsive className="w-full max-w-sm">
      <CardHeader title="Weekly report" description="Sent every Monday at 9:00" />
      <CardBody className="text-muted">Revenue grew 12% and churn dropped to 1.8%.</CardBody>
      <CardFooter>
        <Button size="sm" variant="tertiary" responsive>Later</Button>
        <Button size="sm" responsive>Open</Button>
      </CardFooter>
    </Card>
  );
}
