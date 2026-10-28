import { Timeline } from "nr-ui-kit";

export default function TimelineBasic() {
  return (
    <Timeline
      className="mx-auto max-w-md"
      items={[
        { id: "1", title: "Order received", time: "09:12" },
        { id: "2", title: "Payment confirmed", time: "09:14" },
        { id: "3", title: "Sent to warehouse", time: "11:40" },
        { id: "4", title: "Courier on the way", time: "14:05" },
      ]}
    />
  );
}
