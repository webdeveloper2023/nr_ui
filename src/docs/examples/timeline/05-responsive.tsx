import { Timeline } from "nr-ui-kit";

const items = [
  { id: "1", title: "Order placed by Ali Valiyev", time: "09:12", color: "accent" as const },
  { id: "2", title: "Payment confirmed through the bank", time: "09:14", color: "success" as const },
  { id: "3", title: "Package handed to the courier", time: "11:40" },
];

// Resize the window: on mobile the time moves under the title and items sit tighter.
export default function TimelineResponsive() {
  return <Timeline items={items} responsive className="w-full max-w-md" />;
}
