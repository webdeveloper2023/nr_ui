import { Button, Card, CardBody, Divider, Input } from "nr-ui-kit";

export default function DividerWithLabel() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardBody className="gap-4 py-4">
        <Button variant="outline" fullWidth>Google bilan kirish</Button>
        <Divider>yoki</Divider>
        <Input variant="secondary" placeholder="Email manzilingiz" />
        <Button fullWidth>Davom etish</Button>
      </CardBody>
    </Card>
  );
}
