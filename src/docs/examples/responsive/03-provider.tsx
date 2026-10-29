import { Button, Card, CardBody, CardFooter, CardHeader, Input, ResponsiveProvider, Select } from "nr-ui-kit";

// One provider instead of a prop on every component. A component's own prop still wins.
export default function Provider() {
  return (
    <ResponsiveProvider responsive>
      <Card className="w-full max-w-md">
        <CardHeader title="Delivery address" description="Everything inside follows the screen size." />
        <CardBody className="gap-3">
          <Input label="Street" placeholder="Amir Temur 15" />
          <Select
            label="City"
            placeholder="Choose a city"
            items={[
              { key: "tashkent", label: "Tashkent" },
              { key: "samarkand", label: "Samarkand" },
              { key: "bukhara", label: "Bukhara" },
            ]}
          />
        </CardBody>
        <CardFooter>
          <Button variant="tertiary" responsive={false}>Cancel (static)</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </ResponsiveProvider>
  );
}
