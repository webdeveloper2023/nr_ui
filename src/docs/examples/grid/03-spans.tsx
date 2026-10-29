import { Card, CardBody, CardHeader, Grid, GridItem } from "nr-ui-kit";

// A span never exceeds the columns on the current breakpoint, so the layout cannot break on mobile.
export default function Spans() {
  return (
    <Grid cols={3} responsive className="w-full">
      <GridItem span={2}>
        <Card className="h-full">
          <CardHeader title="Revenue" description="span={2}" />
          <CardBody className="text-muted">Wide on laptop, full width on mobile.</CardBody>
        </Card>
      </GridItem>
      <Card>
        <CardHeader title="Orders" description="1 column" />
      </Card>
      <GridItem span="full">
        <Card>
          <CardHeader title="Activity" description={`span="full"`} />
        </Card>
      </GridItem>
    </Grid>
  );
}
