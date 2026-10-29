import { Card, CardBody, CardHeader, Grid, PieChart } from "nr-ui-kit";

const traffic = [
  { key: "search", label: "Search", value: 46 },
  { key: "direct", label: "Direct", value: 27 },
  { key: "social", label: "Social", value: 17 },
  { key: "email", label: "Email", value: 10 },
];
const devices = [
  { key: "phone", label: "Phone", value: 61 },
  { key: "desktop", label: "Desktop", value: 31 },
  { key: "tablet", label: "Tablet", value: 8 },
];

// On a phone the cards stack and each legend moves under its chart.
export default function PieResponsive() {
  return (
    <Grid cols={2} responsive className="w-full">
      <Card responsive>
        <CardHeader title="Traffic source" />
        <CardBody className="pb-5">
          <PieChart aria-label="Traffic by source, percent" variant="donut" data={traffic} size={180} responsive />
        </CardBody>
      </Card>
      <Card responsive>
        <CardHeader title="Devices" />
        <CardBody className="pb-5">
          <PieChart aria-label="Visits by device, percent" data={devices} size={180} responsive />
        </CardBody>
      </Card>
    </Grid>
  );
}
